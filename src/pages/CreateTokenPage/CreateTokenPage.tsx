import { FC, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  List,
  Section,
  Text,
  Title,
  Avatar,
  Progress,
  Divider,
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
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      alert(`Congratulations! ${tokenName} (${tokenSymbol}) has been created successfully!`);
      navigate('/');
    } catch (error) {
      console.error('Error creating token:', error);
      alert('Failed to create token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressValue = () => {
    switch (formStep) {
      case 1:
        return validateStep1() ? 33 : 0;
      case 2:
        return validateStep2() ? 66 : 33;
      case 3:
        return 100;
      default:
        return 0;
    }
  };

  const renderHeader = () => (
    <div className={element('header')}>
      <Button onClick={handleBack} size="m">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
      <div>
        <Title level="2">Create Token</Title>
        {formStep > 1 && (
          <Text className={element('section-description')} style={{ margin: 0 }}>
            Step {formStep} of 3
          </Text>
        )}
      </div>
      <Progress value={getProgressValue()} />
    </div>
  );

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
      <div className={element('slider-label')}>
        {label}
        <span style={{ color: '#60a5fa', marginLeft: '8px' }}>{value}%</span>
      </div>
      <input
        type="range"
        className={element('slider')}
        value={value}
        onChange={(e) => setter(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
      />
      {helpText && (
        <Text className={element('help-text')}>
          {helpText}
        </Text>
      )}
    </div>
  );

  const renderLogoUploader = () => (
    <div className={element('form-group')}>
      <div className={element('input-label')}>Token Logo *</div>
      <div className={element('logo-uploader')}>
        {tokenLogo ? (
          <div className={element('logo-preview-container')}>
            <Avatar 
              src={tokenLogo} 
              alt="Token Logo" 
              width={140} 
              height={140} 
              style={{ borderRadius: '16px' }}
            />
            <Button
              onClick={handleSelectLogo}
              className={element('change-logo-button')}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: '8px' }}
              >
                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
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
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-3-4h.01M8 21h8a4 4 0 004-4v-8a4 4 0 00-4-4H8a4 4 0 00-4 4v8a4 4 0 004 4z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
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
          "Initial Liquidity Pool",
          liquidityPercentage,
          setLiquidityPercentage,
          30,
          100,
          1,
          "Higher initial liquidity provides better price stability and trading experience"
        )}

        <div className={element('fee-info')}>
          <Text className={element('fee-label')}>Token Creation Fee:</Text>
          <Text className={element('fee-value')}>{launchFee} TON</Text>
        </div>
      </Section>
      
      <Section header="Token Preview">
        <div className={element('token-preview')}>
          <div className={element('token-preview-header')}>
            <Avatar 
              src={tokenLogo || ''} 
              alt={tokenName} 
              width={64} 
              height={64}
              style={{ borderRadius: '12px' }}
            />
            <div className={element('token-preview-info')}>
              <Title level="3">{tokenName || 'Token Name'}</Title>
              <Text style={{ color: '#8892b0' }}>{tokenSymbol || 'SYM'}</Text>
            </div>
          </div>
          <Divider />
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
          size="l"
        >
          Back
        </Button>
        <Button
          className={element('action-button')}
          onClick={handleCreateToken}
          loading={isLoading}
          disabled={!wallet}
          size="l"
        >
          {wallet ? 'Create Token' : 'Connect Wallet to Create'}
        </Button>
      </div>
    </>
  );

  return (
    <Page>
      <div className={block()}>
        {renderHeader()}
        <List>{formStep === 1 ? renderStep1() : formStep === 2 ? renderStep2() : renderStep3()}</List>
      </div>
    </Page>
  );
};