import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/console-types';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export const IssuerModel: K8sGroupVersionKind = {
  group: 'cert-manager.io',
  version: 'v1',
  kind: 'Issuer',
};

export const ClusterIssuerModel: K8sGroupVersionKind = {
  group: 'cert-manager.io',
  version: 'v1',
  kind: 'ClusterIssuer',
};

export interface Issuer extends K8sResourceCommon {
  spec?: {
    acme?: { server?: string; email?: string; [key: string]: unknown };
    ca?: { secretName?: string; [key: string]: unknown };
    vault?: { server?: string; path?: string; [key: string]: unknown };
    [key: string]: unknown;
  };
  status?: {
    conditions?: Array<{ type: string; status: string; reason?: string; message?: string }>;
    [key: string]: unknown;
  };
}

export interface ClusterIssuer extends K8sResourceCommon {
  spec?: {
    acme?: { server?: string; email?: string; [key: string]: unknown };
    ca?: { secretName?: string; [key: string]: unknown };
    vault?: { server?: string; path?: string; [key: string]: unknown };
    [key: string]: unknown;
  };
  status?: {
    conditions?: Array<{ type: string; status: string; reason?: string; message?: string }>;
    [key: string]: unknown;
  };
}
