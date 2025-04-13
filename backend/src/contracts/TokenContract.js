/**
 * Represents a TON Token Contract
 * In a real implementation, this would be a FunC/TVM assembly contract
 * This is a JavaScript representation of the contract for reference
 */
class TokenContract {
  /**
   * Template for a FunC Token Contract for TON blockchain
   * @returns {string} Contract code as a string
   */
  static getTemplateCode() {
    return `
;; Standard FunC TON Token Contract Template
;; Based on the FIP-64 standard (TON equivalent of ERC-20)

#include "stdlib.fc";

;; Storage
;; storage#_ total_supply:Coins owner_address:MsgAddress content:^Cell wallets:^(HashmapE 256 Coins) = Storage;

(int, slice, cell, cell) load_data() inline {
    var ds = get_data().begin_parse();
    return (
        ds~load_coins(), ;; total_supply
        ds~load_msg_addr(), ;; owner_address
        ds~load_ref(), ;; content
        ds~load_ref() ;; wallets
    );
}

() save_data(int total_supply, slice owner_address, cell content, cell wallets) impure inline {
    set_data(begin_cell()
        .store_coins(total_supply)
        .store_slice(owner_address)
        .store_ref(content)
        .store_ref(wallets)
        .end_cell());
}

;; Get Token Info (name, symbol, etc.)
(cell) get_token_data() method_id {
    var (total_supply, owner_address, content, wallets) = load_data();
    return content;
}

;; Get Wallet Balance
(int) get_wallet_balance(slice wallet_address) method_id {
    var (total_supply, owner_address, content, wallets) = load_data();
    var (wallet_hash) = slice_hash(wallet_address);
    var (wallet_exists, wallet_balance) = wallets.udict_get?(256, wallet_hash);
    if (wallet_exists) {
        return wallet_balance;
    } else {
        return 0;
    }
}

;; Get Price in TON
(int) get_price() method_id {
    var (total_supply, owner_address, content, wallets) = load_data();
    var cs = content.begin_parse();
    cs~load_ref(); ;; Skip name, symbol, etc.
    return cs~load_coins(); ;; price in TON per token
}

;; Transfer Tokens
() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) { ;; Ignore bounced messages
        return ();
    }
    slice sender_address = cs~load_msg_addr();
    cs~load_msg_addr(); ;; Skip dst address
    cs~load_coins(); ;; Skip value
    cs~skip_bits(1); ;; Skip extracurrency
    cs~load_coins(); ;; Skip ihr_fee
    int fwd_fee = cs~load_coins();

    int op = in_msg_body~load_uint(32);
    
    if (op == 0x10) { ;; transfer tokens
        int amount = in_msg_body~load_coins();
        slice to_address = in_msg_body~load_msg_addr();
        
        var (total_supply, owner_address, content, wallets) = load_data();
        
        ;; Check sender balance
        var (sender_hash) = slice_hash(sender_address);
        var (exists, sender_balance) = wallets.udict_get?(256, sender_hash);
        throw_unless(100, exists);
        throw_unless(101, sender_balance >= amount);
        
        ;; Update sender balance
        sender_balance -= amount;
        wallets~udict_set(256, sender_hash, sender_balance);
        
        ;; Update recipient balance
        var (to_hash) = slice_hash(to_address);
        var (to_exists, to_balance) = wallets.udict_get?(256, to_hash);
        if (to_exists) {
            to_balance += amount;
        } else {
            to_balance = amount;
        }
        wallets~udict_set(256, to_hash, to_balance);
        
        save_data(total_supply, owner_address, content, wallets);
        return ();
    }
    
    if (op == 0x11) { ;; mint tokens
        int amount = in_msg_body~load_coins();
        slice to_address = in_msg_body~load_msg_addr();
        
        var (total_supply, owner_address, content, wallets) = load_data();
        
        ;; Only owner can mint
        throw_unless(102, equal_slices(sender_address, owner_address));
        
        ;; Update total supply
        total_supply += amount;
        
        ;; Update recipient balance
        var (to_hash) = slice_hash(to_address);
        var (to_exists, to_balance) = wallets.udict_get?(256, to_hash);
        if (to_exists) {
            to_balance += amount;
        } else {
            to_balance = amount;
        }
        wallets~udict_set(256, to_hash, to_balance);
        
        save_data(total_supply, owner_address, content, wallets);
        return ();
    }
    
    if (op == 0x12) { ;; buy tokens with TON
        var (total_supply, owner_address, content, wallets) = load_data();
        
        ;; Get token price
        var cs = content.begin_parse();
        cs~load_ref(); ;; Skip name, symbol, etc.
        int price = cs~load_coins(); ;; price in TON per token
        
        ;; Calculate token amount
        int token_amount = msg_value / price;
        throw_unless(103, token_amount > 0);
        
        ;; Update recipient balance
        var (buyer_hash) = slice_hash(sender_address);
        var (buyer_exists, buyer_balance) = wallets.udict_get?(256, buyer_hash);
        if (buyer_exists) {
            buyer_balance += token_amount;
        } else {
            buyer_balance = token_amount;
        }
        wallets~udict_set(256, buyer_hash, buyer_balance);
        
        ;; Send excess TON back if needed
        int excess = msg_value - (token_amount * price);
        if (excess > 0) {
            var msg = begin_cell()
                .store_uint(0x10, 6)
                .store_slice(sender_address)
                .store_coins(excess)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .end_cell();
            send_raw_message(msg, 1);
        }
        
        ;; Send TON to owner
        var owner_msg = begin_cell()
            .store_uint(0x10, 6)
            .store_slice(owner_address)
            .store_coins(token_amount * price)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .end_cell();
        send_raw_message(owner_msg, 1);
        
        save_data(total_supply, owner_address, content, wallets);
        return ();
    }
    
    if (op == 0x13) { ;; sell tokens for TON
        int token_amount = in_msg_body~load_coins();
        
        var (total_supply, owner_address, content, wallets) = load_data();
        
        ;; Get token price
        var cs = content.begin_parse();
        cs~load_ref(); ;; Skip name, symbol, etc.
        int price = cs~load_coins(); ;; price in TON per token
        
        ;; Check sender balance
        var (seller_hash) = slice_hash(sender_address);
        var (exists, seller_balance) = wallets.udict_get?(256, seller_hash);
        throw_unless(100, exists);
        throw_unless(101, seller_balance >= token_amount);
        
        ;; Calculate TON amount
        int ton_amount = token_amount * price;
        
        ;; Update seller balance
        seller_balance -= token_amount;
        wallets~udict_set(256, seller_hash, seller_balance);
        
        ;; Send TON to seller
        var msg = begin_cell()
            .store_uint(0x10, 6)
            .store_slice(sender_address)
            .store_coins(ton_amount)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .end_cell();
        send_raw_message(msg, 1);
        
        save_data(total_supply, owner_address, content, wallets);
        return ();
    }
    
    ;; Default behavior is to throw
    throw(0xffff);
}
    `;
  }

  /**
   * Returns initialization data for the token contract
   * @param {string} name - Token name
   * @param {string} symbol - Token symbol
   * @param {string} totalSupply - Total supply
   * @param {string} ownerAddress - Owner's address
   * @param {number} price - Token price in TON
   * @returns {string} Initialization data as a hex string
   */
  static getInitData(name, symbol, totalSupply, ownerAddress, price = 0.0001) {
    // In a real implementation, this would encode the initialization data
    // for the contract according to TON specifications
    
    return `
      // This would be a binary cell with:
      // 1. Total supply
      // 2. Owner address
      // 3. Content cell with name/symbol/decimals/price
      // 4. Empty dictionary for wallets
    `;
  }
}

module.exports = TokenContract; 