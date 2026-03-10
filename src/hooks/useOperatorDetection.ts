import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk';

export type OperatorStatus = 'loading' | 'installed' | 'not-installed';

export interface OperatorInfo {
  displayName: string;
  group: string;
  version: string;
  kind: string;
}

export const CERT_MANAGER_OPERATOR_INFO: OperatorInfo = {
  displayName: 'cert-manager Operator for Red Hat OpenShift',
  group: 'cert-manager.io',
  version: 'v1',
  kind: 'Certificate',
};

export const NFD_OPERATOR_INFO: OperatorInfo = {
  displayName: 'Node Feature Discovery Operator',
  group: 'nfd.openshift.io',
  version: 'v1',
  kind: 'NodeFeatureDiscovery',
};

export const PIPELINES_OPERATOR_INFO: OperatorInfo = {
  displayName: 'Red Hat OpenShift Pipelines',
  group: 'operator.tekton.dev',
  version: 'v1alpha1',
  kind: 'TektonConfig',
};

export function useOperatorDetection(info: OperatorInfo): OperatorStatus {
  const [model, inFlight] = useK8sModel({
    group: info.group,
    version: info.version,
    kind: info.kind,
  });
  if (inFlight) return 'loading';
  return model ? 'installed' : 'not-installed';
}
