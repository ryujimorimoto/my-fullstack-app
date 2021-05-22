import React, {useEffect} from 'react';
import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { parse } from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import axiosBase from 'axios';
import { SkeletonBodyText, SkeletonPage, Layout, TextContainer, SkeletonDisplayText } from '@shopify/polaris'

export default function AppInstall(props) {
  useEffect(async () => {
    const query = parse(props.location.search);
    const shopOrigin = query.shop;
    // インストール対象のストアチェック
    if(typeof shopOrigin == 'undefined'){
      // ストアURLがなければ、入力画面へ遷移
      return window.location.assign(process.env.REACT_APP_APPLICATION_URL + '/auth/shop_domain');
    }
    // インストール済みかをチェック
    const shopExisted = await shopExist(shopOrigin)
    console.log("shopExist:", shopExisted)
    // インストールしていなければ、インストール画面へリダイレクト
    // インストールしていれば、/topへリダイレクト
    return await appRedirect(shopExisted, shopOrigin, query);
  },[]);

  return (
    <div className="Auth">
      <SkeletonPage primaryAction secondaryActions={2}>
        <Layout>
          <Layout.Section>
            <SkeletonBodyText />
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Layout.Section>
          <Layout.Section secondary>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={2} />
            </TextContainer>
            <SkeletonBodyText lines={1} />
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={2} />
            </TextContainer>
            <SkeletonBodyText lines={2} />
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    </div>
  );

}
async function shopExist(shopOrigin){
  const axios = axiosBase.create({
    baseURL: process.env.REACT_APP_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'json'
  })
  const res = await axios.get('/shop/exist'+'?shop='+ shopOrigin)
  console.log("======================\n",res.data);
  return {exist: res.data.exist, access_token: res.data.access_token};
}
async function appRedirect(shopExisted, shopOrigin, query){
  const apiKey = process.env.REACT_APP_SHOPIFY_API_KEY;
  const scope = process.env.REACT_APP_SCOPES;
  if(shopExisted.exist){
    if (window.top === window.self) {
      console.log("Shopifyアプリ画面以外")
      window.location.assign(process.env.REACT_APP_APPLICATION_URL + '/top?shop=' + shopOrigin);
    } else {
      const app = createApp({
        apiKey: apiKey,
        host: Buffer.from(shopOrigin).toString('base64'),
      });
      console.log("Shopifyアプリ画面", apiKey, shopOrigin)
      Redirect.create(app).dispatch(Redirect.Action.APP, '/top?shop=' + shopOrigin);
    }
  }else{
    const nonce = uuidv4()
    const access_mode = 'offline'
    const redirectUri = process.env.REACT_APP_APPLICATION_URL + '/auth/callback';
    const permissionUrl = `https://${shopOrigin}/admin/oauth/authorize?client_id=${apiKey}&scope=${scope}&redirect_uri=${redirectUri}&state=${nonce}&grant_options[]=${access_mode}`;
    
    if (window.top === window.self) {
      window.location.assign(permissionUrl);
    } else {
      const app = createApp({
        apiKey: apiKey,
        host: Buffer.from(shopOrigin).toString('base64'),
      });
      console.log(app);
      Redirect.create(app).dispatch(Redirect.Action.REMOTE, permissionUrl);
    }
  }
}