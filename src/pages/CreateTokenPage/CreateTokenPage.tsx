import { FC, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Cell,
  List,
  Section,
  Text,
  Title,
  Avatar,
} from '@telegram-apps/telegram-ui';
import { useTonWallet } from '@tonconnect/ui-react';
import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';

import './CreateTokenPage.css';

const [block, element] = bem('create-token-page');

export const CreateTokenPage: FC = () => {
  const navigate = useNavigate();
  const wallet = useTonWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenSupply, setTokenSupply] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [tokenDetails, setTokenDetails] = useState('');
  const [tokenTelegramLink, setTokenTelegramLink] = useState('');
  const [tokenTwitterLink, setTokenTwitterLink] = useState('');
  const [tokenWebsite, setTokenWebsite] = useState('');
  const [liquidityPercentage, setLiquidityPercentage] = useState(50);
  const [tokenLogo, setTokenLogo] = useState<string | null>(null);
  const launchFee = 0.5; // TON fee to create token

  const handleBack = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleNext = () => {
    setFormStep(formStep + 1);
  };

  const validateStep1 = () => {
    return tokenName.trim() !== '' && 
           tokenSymbol.trim() !== '' && 
           tokenSupply.trim() !== '' &&
           tokenLogo !== null;
  };

  const validateStep2 = () => {
    return tokenDescription.trim() !== '';
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert('Only JPG, PNG and SVG files are allowed');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setTokenLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectLogo = () => {
    fileInputRef.current?.click();
  };

  const handleCreateToken = async () => {
    if (!wallet) {
      alert('Please connect your wallet to create a token');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This is a placeholder for actual token creation logic
      // In a real implementation, you would:
      // 1. Create a smart contract for the token
      // 2. Deploy it to the TON blockchain
      // 3. Set up liquidity pool
      
      console.log('Creating token with the following details:', {
        name: tokenName,
        symbol: tokenSymbol,
        supply: tokenSupply,
        description: tokenDescription,
        details: tokenDetails,
        logo: tokenLogo, // The logo as a data URL
        liquidityPercentage,
        socialLinks: {
          telegram: tokenTelegramLink,
          twitter: tokenTwitterLink,
          website: tokenWebsite,
        },
      });
      
      // Simulate contract deployment delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Success
      alert(`Congratulations! ${tokenName} (${tokenSymbol}) has been created successfully!`);
      navigate('/');
    } catch (error) {
      console.error('Error creating token:', error);
      alert('Failed to create token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCustomInput = (
    label: string, 
    value: string, 
    setter: React.Dispatch<React.SetStateAction<string>>, 
    placeholder: string,
    helpText?: string,
    isRequired?: boolean,
    maxLength?: number,
    filter?: (val: string) => string
  ) => (
    <div className={element('form-group')}>
      <div className={element('input-label')}>{label}{isRequired && ' *'}</div>
      <input
        type="text"
        className={element('input')}
        value={value}
        onChange={(e) => {
          const val = filter ? filter(e.target.value) : e.target.value;
          setter(val);
        }}
        placeholder={placeholder}
        maxLength={maxLength}
        required={isRequired}
      />
      {helpText && <Text className={element('help-text')}>{helpText}</Text>}
    </div>
  );

  const renderCustomTextArea = (
    label: string, 
    value: string, 
    setter: React.Dispatch<React.SetStateAction<string>>, 
    placeholder: string,
    isRequired?: boolean
  ) => (
    <div className={element('form-group')}>
      <div className={element('input-label')}>{label}{isRequired && ' *'}</div>
      <textarea
        className={element('textarea')}
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={placeholder}
        required={isRequired}
        rows={4}
      />
    </div>
  );

  const renderCustomSlider = (
    label: string,
    value: number,
    setter: React.Dispatch<React.SetStateAction<number>>,
    min: number,
    max: number,
    step: number,
    helpText?: string
  ) => (
    <div className={element('form-group')}>
      <div className={element('slider-label')}>{label}: {value}%</div>
      <input
        type="range"
        className={element('slider')}
        value={value}
        onChange={(e) => setter(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
      />
      {helpText && <Text className={element('help-text')}>{helpText}</Text>}
    </div>
  );

  const renderLogoUploader = () => (
    <div className={element('form-group')}>
      <div className={element('input-label')}>Token Logo *</div>
      <div className={element('logo-uploader')}>
        {tokenLogo ? (
          <div className={element('logo-preview-container')}>
            <Avatar src={tokenLogo} alt="Token Logo" width={100} height={100} />
            <Button 
              onClick={handleSelectLogo}
              className={element('change-logo-button')}
            >
              Change Logo
            </Button>
          </div>
        ) : (
          <div className={element('logo-placeholder')} onClick={handleSelectLogo}>
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Upload Logo</span>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/jpeg,image/png,image/svg+xml"
          onChange={handleLogoUpload}
        />
      </div>
      <Text className={element('help-text')}>
        Upload a JPG, PNG, or SVG file (max 5MB). This will be your token's brand identity.
      </Text>
    </div>
  );

  const renderStep1 = () => (
    <>
      <Section>
        <Title level="3">Basic Information</Title>
        <Text className={element('section-description')}>
          Enter the basic details for your meme token
        </Text>
      </Section>
      
      <Section>
        {renderLogoUploader()}

        {renderCustomInput(
          "Token Name",
          tokenName,
          setTokenName,
          "e.g. TonDoge",
          undefined,
          true
        )}
        
        {renderCustomInput(
          "Token Symbol",
          tokenSymbol,
          setTokenSymbol,
          "e.g. TDOGE",
          "Max 6 characters, uppercase recommended",
          true,
          6
        )}
        
        {renderCustomInput(
          "Total Supply",
          tokenSupply,
          setTokenSupply,
          "e.g. 1000000000",
          "Total number of tokens to create",
          true,
          undefined,
          (val) => val.replace(/[^0-9]/g, '')
        )}

        {renderCustomTextArea(
          "Token Details",
          tokenDetails,
          setTokenDetails,
          "Enter additional details about your token, such as its purpose, use cases, or unique features...",
          false
        )}
      </Section>
      
      <Button
        className={element('action-button')}
        onClick={handleNext}
        disabled={!validateStep1()}
      >
        Next
      </Button>
    </>
  );

  const renderStep2 = () => (
    <>
      <Section>
        <Title level="3">Token Description & Links</Title>
        <Text className={element('section-description')}>
          Provide additional information about your token
        </Text>
      </Section>
      
      <Section>
        {renderCustomTextArea(
          "Description",
          tokenDescription,
          setTokenDescription,
          "Describe your token and its purpose...",
          true
        )}
        
        {renderCustomInput(
          "Telegram Group/Channel (Optional)",
          tokenTelegramLink,
          setTokenTelegramLink,
          "https://t.me/yourtokengroup"
        )}
        
        {renderCustomInput(
          "Twitter (Optional)",
          tokenTwitterLink,
          setTokenTwitterLink,
          "https://twitter.com/yourtoken"
        )}
        
        {renderCustomInput(
          "Website (Optional)",
          tokenWebsite,
          setTokenWebsite,
          "https://yourtoken.com"
        )}
      </Section>
      
      <div className={element('button-group')}>
        <Button
          className={element('secondary-button')}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          className={element('action-button')}
          onClick={handleNext}
          disabled={!validateStep2()}
        >
          Next
        </Button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <Section>
        <Title level="3">Launch Configuration</Title>
        <Text className={element('section-description')}>
          Set up liquidity and review launch settings
        </Text>
      </Section>
      
      <Section>
        {renderCustomSlider(
          "Liquidity Percentage",
          liquidityPercentage,
          setLiquidityPercentage,
          30,
          100,
          1,
          "Percentage of tokens allocated for liquidity pool"
        )}
      </Section>
      
      <Section header="Launch Fee">
        <Cell>
          <div className={element('fee-info')}>
            <Text className={element('fee-label')}>Token Creation Fee:</Text>
            <Text className={element('fee-value')}>{launchFee} TON</Text>
          </div>
        </Cell>
      </Section>
      
      <Section header="Token Information">
        <div className={element('token-preview')}>
          <div className={element('token-preview-header')}>
            <Avatar src={tokenLogo || ''} alt={tokenName} width={64} height={64} />
            <div className={element('token-preview-info')}>
              <Title level="3">{tokenName || 'Token Name'}</Title>
              <Text>{tokenSymbol || 'SYM'}</Text>
            </div>
          </div>
          <div className={element('token-preview-details')}>
            <div className={element('summary-item')}>
              <Text className={element('summary-label')}>Total Supply:</Text>
              <Text>{Number(tokenSupply).toLocaleString() || '0'} tokens</Text>
            </div>
            <div className={element('summary-item')}>
              <Text className={element('summary-label')}>Initial Liquidity:</Text>
              <Text>{liquidityPercentage}%</Text>
            </div>
            {tokenDetails && (
              <div className={element('summary-item')}>
                <Text className={element('summary-label')}>Token Details:</Text>
                <Text className={element('token-description')}>{tokenDetails}</Text>
              </div>
            )}
            {tokenDescription && (
              <div className={element('summary-item')}>
                <Text className={element('summary-label')}>Description:</Text>
                <Text className={element('token-description')}>{tokenDescription}</Text>
              </div>
            )}
          </div>
        </div>
      </Section>
      
      <div className={element('button-group')}>
        <Button
          className={element('secondary-button')}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          className={element('action-button')}
          onClick={handleCreateToken}
          loading={isLoading}
          disabled={!wallet}
        >
          {wallet ? 'Create Token' : 'Connect Wallet to Create'}
        </Button>
      </div>
    </>
  );

  return (
    <Page>
      <div className={block()}>
        <div className={element('header')}>
          <Button onClick={handleBack}>Back</Button>
          <Title level="2">
            Create Token {formStep > 1 ? `(${formStep}/3)` : ''}
          </Title>
        </div>
        
        <List>
          {formStep === 1 && renderStep1()}
          {formStep === 2 && renderStep2()}
          {formStep === 3 && renderStep3()}
        </List>
      </div>
    </Page>
  );
}; 