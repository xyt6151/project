import { useContext, useState, useEffect } from 'react';
import { CredentialContext } from '../../pages/_app';
import { getRequiredCredentialLevel } from '../credentialMappings';
import { supabase, getPrivilegedClient } from '../supabase';

export const useCredentialAccess = (sectionId: string) => {
  const { credentialLevel } = useContext(CredentialContext);
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState(supabase);

  useEffect(() => {
    const checkAccess = async () => {
      if (credentialLevel === 'privileged' || credentialLevel === 'admin') {
        const privilegedClient = await getPrivilegedClient();
        setClient(privilegedClient);
      }
      setIsLoading(false);
    };

    checkAccess();
  }, [credentialLevel]);

  const hasAccess = getRequiredCredentialLevel(sectionId) <= getRequiredCredentialLevel(credentialLevel);

  return { hasAccess, isLoading, client };
}; 