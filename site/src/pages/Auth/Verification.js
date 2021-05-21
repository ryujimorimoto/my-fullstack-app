// パラメータがなければ、/topへリダイレクト
// パラメータがあれば、そのメールアドレスが認証済みか判定
// 認証済みNotAuthorizedExceptionであれば、認証済みだと表示
// 認証済みでなければ、そのメールアドレスに対しての認証を行う
import React, {useCallback, useState} from 'react';
import {AppProvider, ContextualSaveBar,InlineError,
    Frame, Layout, Page, TopBar, Card,
    TextField, Form, FormLayout, Button, Spinner } from '@shopify/polaris';
import {
  useHistory,
} from 'react-router-dom'

import cognitoBase from '../../utils/cognito.js'
const cognito = new cognitoBase();

export default function Verification(props) {
  const params = props.match.params
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState('')
  const [inputForm, setInputForm] = useState(true)
  const [codeFieldValue, setCodeFieldValue] = useState('')
  const [verifyLoading, setVerifyLoading] = useState(false)
  async function verification_component(code) {
    // UserNotFoundException メール違い
    // CodeMismatchException コード違い
    // ExpiredCodeException  コード期限切れ
    // NotAuthorizedException 登録済み
    switch(code){
      case "NotAuthorizedException":
        setErrorMessage("登録済みのアカウントです");
        break;
      case "UserNotFoundException":
        setErrorMessage("このメールアドレスは登録されていません");
        break;
      case "CodeMismatchException":
        setErrorMessage("認証コードが違います");
        break;
      case "ExpiredCodeException":
        setErrorMessage("期限切れの認証コードです");
        break;
      case "LimitExceededException":
        setErrorMessage("一定回数以上の認証に失敗しました");
        break;
      default:
        setErrorMessage("認証に失敗しました");
    }
    setVerifyLoading(false)
  }
  
  const [isDirty, setIsDirty] = useState(false);

    const [searchFieldValue, setSearchFieldValue] = useState('');
    const toggleIsDirty = useCallback(
      () => setIsDirty((isDirty) => !isDirty),
      [],
    );
  const handleSearchChange = useCallback(
    (searchFieldValue) => setSearchFieldValue(searchFieldValue),
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
    
    async function handleVerifySubmit(e) {
      e.preventDefault()
      setVerifyLoading(true)
      // ユーザーの認証
      cognito.confirmation(params.email, codeFieldValue).then( user => {
        history.push("/login?show=sign_in&flash=アカウント登録が完了しました")
      }).catch( error => {
        console.log("Error:", error)
        verification_component(error.code);
      });
    }
    
    const verifySubmitButton = verifyLoading == false ?
    (<Button size="big" submit>認証する</Button>) :
    (<Spinner accessibilityLabel="ローディング..." size="large" color="teal" />)
    const handleCodeFieldChange = useCallback(
      (value) => setCodeFieldValue(value),
      [],
    );
  const pageMarkup = (
    <Page title="">
      <Layout>
  <Layout.Section>
    <Card title="認証コードを入力してください" sectioned>
      <p>
        ご登録のメールアドレスへ認証コードをお送りしました。<br />
        6桁の数字を入力し、アカウント登録を完了してください。
      </p>
      {/* TODO: 認証コード再送ボタンを作る */}
      <br />
      <div className={"show-" + inputForm} >
        <Form onSubmit={handleVerifySubmit}>
          <FormLayout>
            <TextField 
            type="text" 
            label="認証コード" 
            onChange={handleCodeFieldChange} 
            value={codeFieldValue} 
            areaExpand={true}
            autoFocus={true}
            max="6"
            maxLength="6"
            inputMode="numerical"
            placeholder="123456"
            />
            <InlineError message={errorMessage} fieldID="myFieldID" />
            
            {verifySubmitButton}
            
          </FormLayout>
        </Form>
      </div>
    </Card>
  </Layout.Section>
</Layout>
    </Page>
  );
    return(
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
            {contextualSaveBarMarkup}
            {pageMarkup}
          </Frame>
        </AppProvider>
  </div>
    )
};