import React, {useEffect} from 'react';
import { parse } from 'query-string';
import axiosBase from 'axios';

export default function Callback(props) {
  useEffect(async () => {
    const query = parse(props.location.search);
    const token = await oauth(query)
    const redirectUri = `https://${query.shop}/admin/apps/${process.env.REACT_APP_SHOPIFY_API_KEY}/top`
    window.location.assign(redirectUri);
  }, [])

  return (
    <div className="Callback">Loading...</div>
  )
}


async function oauth(query){
  const axios = axiosBase.create({
    baseURL: process.env.REACT_APP_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'json'
  });
  console.dir("shopify query:", query);
  const res = await axios.get(`/oauth?code=${query.code}&host=${query.host}&shop=${query.shop}&hmac=${query.hmac}&state=${query.state}&timestamp=${query.timestamp}`)
  return res
}