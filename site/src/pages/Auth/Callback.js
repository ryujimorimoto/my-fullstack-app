import React from 'react';
import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { parse } from 'query-string';
import axiosBase from 'axios';

class Callback extends React.Component {

  async oauth(query){
    const axios = axiosBase.create({
      baseURL: process.env.REACT_APP_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json'
    });
    console.dir("shopify query:", query);
    const res = await axios.get(`/oauth?code=${query.code}&shop=${query.shop}&hmac=${query.hmac}&state=${query.state}&timestamp=${query.timestamp}`)
    return res
  }

  async componentDidMount() {
    const query = parse(this.props.location.search);
    const token = await this.oauth(query)

    const redirectUri = `https://${query.shop}/admin/apps/${process.env.REACT_APP_SHOPIFY_API_KEY}/top`
    window.location.assign(redirectUri);
  }  

  render() {
    return (
      <div className="Callback"></div>
    )
  }
}

export default Callback;
