import React, { useCallback, useState, useEffect } from 'react';
import {AppProvider, ContextualSaveBar,
    Frame, Layout, Page, TopBar, Card,
    TextField, Form, FormLayout, Tabs, Button, Spinner,
    Toast, Banner } from '@shopify/polaris';
import { useHistory } from 'react-router-dom'
import { parse } from 'query-string';

import createApp from '@shopify/app-bridge';
import {
  userRegister,
  userLogin,
} from '../../utils/auth_api';

export default function SignIn(props) {
  // タブ定義
  const params = parse(window.location.search);
  const [selected, setSelected] = useState( Object.keys(params).includes("show") ? 1 : 0 );
  const [shopUrl, setShopUrl] = useState('');
  const history = useHistory();
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );
  const tabs = [
    {
      id: 'sign-up',
      content: 'アカウント登録',
      panelID: 'sign_up',
    },
    {
      id: 'sign-in',
      content: 'ログイン',
      accessibilityLabel: 'Sign In',
      panelID: 'sign_in',
    },
  ];

  // タブ定義 終了

  // レイアウト定義
  const [isDirty, setIsDirty] = useState(false);
  const [searchFieldValue, setSearchFieldValue] = useState('');

  const handleSearchChange = useCallback(
    (searchFieldValue) => setSearchFieldValue(searchFieldValue),
    [],
  );

  const toggleIsDirty = useCallback(
    () => setIsDirty((isDirty) => !isDirty),
    [],
  );

  const theme = {
    colors: {
      topBar: {
        background: '#fff',
        backgroundLighter: '#F4F6F8',
        backgroundDarker: '#DFE3E8',
        border: '#C4CDD5',
        color: '#212B36',
      },
    },
    logo: {
      width: 124,
      topBarSource:
        'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-color.svg?6215648040070010999',
      url: 'http://jadedpixel.com',
      accessibilityLabel: 'Jaded Pixel',
      contextualSaveBarSource:
        'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999',
    },
  };

  const searchFieldMarkup = (
    <TopBar.SearchField
      placeholder="Search"
      value={searchFieldValue}
      onChange={handleSearchChange}
    />
  );

  const topBarMarkup = <TopBar searchField={searchFieldMarkup} />;

  const contentStatus = isDirty ? 'Disable' : 'Enable';
  const textStatus = isDirty ? 'enabled' : 'disabled';

  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message="Unsaved changes"
      saveAction={{
        onAction: toggleIsDirty,
      }}
      discardAction={{
        onAction: toggleIsDirty,
      }}
    />
  ) : null;
  const [emailFieldValue, setEmailFieldValue] = useState('');
  const [nameFieldValue, setNameFieldValue] = useState('');
  const [passwordFieldValue, setPasswordFieldValue] = useState('');
  const [passwordConfirmFieldValue, setPasswordConfirmFieldValue] = useState('');
  const [signUpLoading, setSingUpLoading] = useState(false)
  const [errorToast, setErrorToast] = useState(false)
  const [flashBanner, setFlashBanner] = useState(false)
  const toggleErrorToast = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
  const toggleFlashBanner = useCallback(() => setFlashBanner((flashBanner) => !flashBanner), []);

  const handleEmailFieldChange = useCallback(
    (value) => setEmailFieldValue(value),
    [],
  );
  const handleNameFieldChange = useCallback(
    (value) => setNameFieldValue(value),
    [],
  );
  
  const handlePasswordFieldChange = useCallback(
    (value) => setPasswordFieldValue(value),
    [],
  );

  const handlePasswordConfirmFieldChange = useCallback(
    (value) => setPasswordConfirmFieldValue(value),
    [],
  );
  const signUpSubmitButton = signUpLoading == false ?
    (<Button size="big" submit>アカウント登録</Button>) :
    (<Spinner accessibilityLabel="ローディング..." size="large" color="teal" />)
  const signInSubmitButton = signUpLoading == false ?
    (<Button size="big" submit>ログイン</Button>) :
    (<Spinner accessibilityLabel="ローディング..." size="large" color="teal" />)
  const showToast = errorToast ? (
      <Toast content={errorToast} error onDismiss={toggleErrorToast} />
    ) : null;
  const showFlashBanner = flashBanner ? (
    <Banner title={flashBanner} status="success" onDismiss={toggleFlashBanner} >
      <p>ログインしてください</p>
    </Banner>
  ) : null;
    
  const store_url = window.location.ancestorOrigins["0"] == null ? undefined : window.location.ancestorOrigins["0"].replace("https://","").replace("http://", "");
  const [shopFieldValue, setShopFieldValue] = useState(store_url);

  const handleShopFieldChange = useCallback(
    (value) => setShopFieldValue(value),
    [],
  );

  const shopFormMarkup = (
    store_url == null ? 
    (<TextField 
      type="text" 
      label="ショップドメイン" 
      onChange={handleShopFieldChange} 
      value={shopFieldValue} 
      areaExpand={true}
      autoFocus={true}
      className="d-none"
      inputMode="text"
      placeholder="shop.shopify.com"
      />) : null
  );
  
  const signInMarkup = (
        <Card.Section id="sign_in">
          <Layout>
            <Layout.AnnotatedSection
              title="ログイン"
              description="アカウントをお持ちでない場合は、アカウント登録をしてください。"
            >
              <Card sectioned>
              <Form onSubmit={handleSignInSubmit}>

                <FormLayout>
                  {shopFormMarkup}
                  <TextField 
                  type="email" 
                  label="メールアドレス" 
                  onChange={handleEmailFieldChange} 
                  value={emailFieldValue} 
                  ariaAutocomplete="email"
                  areaExpand={true}
                  autoFocus={true}
                  inputMode="email"
                  placeholder="メールアドレス"
                  />
                  <TextField 
                  type="password" 
                  label="パスワード" 
                  onChange={handlePasswordFieldChange} 
                  value={passwordFieldValue} 
                  ariaAutocomplete="password"
                  placeholder="パスワード"
                  />
                  {signInSubmitButton}
                </FormLayout>
                </Form>

              </Card>
            </Layout.AnnotatedSection>
          </Layout>
        </Card.Section>
  )
  const signUpMarkup = (
        <Card.Section id="sign_up">
          <Layout>
            <Layout.AnnotatedSection
              title="アカウント登録"
              description="メールアドレスとパスワードを入力し、認証コードを入力してください。
              すでにアカウントをお持ちの場合は、ログインしてください。"
            >
              <Card sectioned>
                <Form onSubmit={handleSignUpSubmit}>
                <FormLayout>
                  <TextField 
                  type="text" 
                  label="お名前" 
                  onChange={handleNameFieldChange} 
                  value={nameFieldValue} 
                  areaExpand={true}
                  autoFocus={true}
                  inputMode="text"
                  placeholder="お名前"
                  />
                  <TextField 
                  type="email" 
                  label="メールアドレス" 
                  onChange={handleEmailFieldChange} 
                  value={emailFieldValue} 
                  areaExpand={true}
                  autoFocus={true}
                  inputMode="email"
                  placeholder="メールアドレス"
                  />
                  <TextField 
                  type="password" 
                  label="パスワード(半角英字、記号、半角数字の全てを含む8桁以上)" 
                  onChange={handlePasswordFieldChange} 
                  value={passwordFieldValue} 
                  placeholder="パスワード"
                  />
                  <TextField 
                  type="password" 
                  label="パスワードの確認" 
                  onChange={handlePasswordConfirmFieldChange} 
                  value={passwordConfirmFieldValue} 
                  placeholder="パスワードの確認"
                  />

                  {signUpSubmitButton}
                  
                </FormLayout>
                </Form>
              </Card>
            </Layout.AnnotatedSection>
          </Layout>
        </Card.Section>
      )

  const pageMarkup = (
    <Page title="">
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
        {selected == 1 ? signInMarkup : signUpMarkup}
      </Tabs>
    </Page>

  );

  // レイアウト定義 終了
  // Formのsubmit処理
  async function handleSignInSubmit(e) {
    e.preventDefault()
    
　　//fromで送られてきた値を処理する

    try{
      setSingUpLoading(true)
      console.log(shopFieldValue)
      // shopFieldValueのストアにアプリがインストール済みかチェック
      const app = createApp({
        apiKey: process.env.REACT_APP_SHOPIFY_API_KEY,
        shopOrigin: shopFieldValue
      });
      await userLogin( emailFieldValue, passwordFieldValue)
      window.location.href = "/top?shop=" + shopFieldValue;
      // history.push("/top?shop=" + shopFieldValue)
      // const redirect_url = process.env.REACT_APP_APPLICATION_URL + "/top?shop=" + shopFieldValue;
      // Redirect.create(app).dispatch(Redirect.Action.ADMIN_PATH, redirect_url);
    } catch(err) {
      console.log(err)
      if(err.name == "AppBridgeError"){
        setErrorToast("ショップドメインまたはAPIキーが違います")
      }else{
        setErrorToast("メールアドレスまたはパスワードが違います")
      }
    }

    setSingUpLoading(false)
  }

  async function handleSignUpSubmit(e) {
    e.preventDefault()
    const validation_reg = /^(?=.*?[a-z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{8,100}$/i
    //パスワードの一致値チェック
    if (passwordFieldValue !== passwordConfirmFieldValue) {
      return setErrorToast("パスワードが一致しません")
    }else if(passwordFieldValue.length < 8){
      return setErrorToast("8文字以上入力してください")
    }else if(passwordFieldValue.match(validation_reg) == null){
      return setErrorToast("英字,記号,数字を全て含む必要があります")
    }


    try {
      setSingUpLoading(true)
      await userRegister( emailFieldValue, passwordFieldValue, nameFieldValue)
      // アカウント登録が成功したら、認証ページへリダイレクトさせている
      history.push( "/verification/" + emailFieldValue)
      // document.location.href = "/verification/" + emailFieldValue;
    } catch(e) {
      let errorMessage = "";
      console.log(e)
      switch(e.code || e){
        case String(e).match(/Error: An account with the given email already exists./) && e:
          errorMessage = "登録済みのメールアドレスです";
          break;
        case "UsernameExistsException":
          errorMessage = "登録済みのメールアドレスです";
          break;
        case "InvalidParameterException":
          errorMessage = "パスワードの値が不正です";
          break;
        default:
          errorMessage = "登録に失敗しました"
      }
      setErrorToast(errorMessage)
    }

    setSingUpLoading(false)
  }

  // Formのsubmit処理 終了
  useEffect(() => {
    if( Object.keys(params).includes("flash") ){
      return setFlashBanner(params["flash"]);
    }
  }, [])
  
  
    return (
      
      <div style={{height: '250px'}}>
      <AppProvider
        theme={theme}
        i18n={{
          Polaris: {
            Frame: {
              skipToContent: 'Skip to content',
            },
            ContextualSaveBar: {
              save: 'Save',
              discard: 'Discard',
            },
            TopBar: {
              SearchField: {
                clearButtonLabel: 'Clear',
                search: 'Search',
              },
            },
          },
        }}
      >

        <Frame topBar={topBarMarkup}>
          {showFlashBanner}
          {contextualSaveBarMarkup}
          {pageMarkup}
          {showToast}
        </Frame>
      </AppProvider>
      
</div>

    );
};