import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';

export const useTenant = (tenantId: string) => {
  const { data, error, isLoading } = useSWR(`/api/tenants/${tenantId}`, fetcher);
  return {
    tenant: data?.data,
    isLoading,
    isError: Boolean(error),
  };
};
