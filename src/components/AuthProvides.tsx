'use client';
import { getProviders, signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Button from './Button';

type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
  signinUrlParams? : Record<string, string> | null;
};

type Providers = Record<string, Provider>;


const AuthProvides = () => {
  const [providers, setProviders] = useState<Providers | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();

      console.log(res);
    
      setProviders(res);
    }

    fetchProviders();
  }, [])//setting dependeny array empty says that perform this after component loads

  if (providers) {
    // console.log(providers);
    return (
      <div>
        {Object.values(providers).map((provider: Provider, i) => (
          <Button 
            key={i} 
            handleClick= {()=> signIn()} 
            title="Sign In"
          />
        ))}
      </div>
    )
  }
}

export default AuthProvides