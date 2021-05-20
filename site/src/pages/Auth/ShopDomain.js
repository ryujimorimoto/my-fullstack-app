import React, {useCallback, useState} from 'react';
import {TextField, Form, FormLayout, AppProvider, Layout, Page, Card, Button} from '@shopify/polaris';

export default function ShopDomain() {

  const [url, setUrl] = useState('');


  const handleUrlChange = useCallback((value) => setUrl(value), []);
  
  
  async function handleSubmit(e) {
    e.preventDefault()
    const shopOrigin = url
    window.location.assign(process.env.REACT_APP_APPLICATION_URL + '/auth?shop=' + shopOrigin);
  }

  return (
    <div style={{height: '250px'}}>
      <div style={{margin: '10vh auto 0px', maxWidth: '320px'}}>
        <img src="https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-primary-logo-456baa801ee66a0a435671082365958316831c9960c480451dd0330bcdae304f.svg" alt="shopify" />
      </div>
      <AppProvider features={{newDesignLanguage: true}} i18n={{}}>
        <Page 
          title="追加するストアを選択してください"
        >
          <Layout>
            <Layout.Section>
              <Card title="Shopifyドメイン" sectioned>
                <Form noValidate onSubmit={handleSubmit}>
                  <FormLayout>
                    <div style={{display: "flex"}}>
                      <div style={{width: "80%", marginRight: "10%"}}>
                        <TextField
                          value={url}
                          onChange={handleUrlChange}
                          type="url"
                          placeholder="shop.myshopify.com"
                        />
                      </div>
                      <Button primary submit={true}>追加</Button>
                    </div>
                  </FormLayout>
                </Form>
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      </AppProvider>
    </div>
  );
}
