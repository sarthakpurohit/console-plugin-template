import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/console-types';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export const CertificateRequestModel: K8sGroupVersionKind = {
  group: 'cert-manager.io',
  version: 'v1',
  kind: 'CertificateRequest',
};

export interface CertificateRequest extends K8sResourceCommon {
  spec?: {
    issuerRef?: { name?: string; kind?: string; group?: string };
    request?: string;
    duration?: string;
    isCA?: boolean;
    [key: string]: unknown;
  };
  status?: {
    conditions?: Array<{ type: string; status: string; reason?: string; message?: string }>;
    certificate?: string;
    ca?: string;
    [key: string]: unknown;
  };
}
