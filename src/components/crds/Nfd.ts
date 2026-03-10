import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/console-types';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export const NodeFeatureDiscoveryModel: K8sGroupVersionKind = {
  group: 'nfd.openshift.io',
  version: 'v1',
  kind: 'NodeFeatureDiscovery',
};

export const NodeFeatureRuleModel: K8sGroupVersionKind = {
  group: 'nfd.k8s-sigs.io',
  version: 'v1alpha1',
  kind: 'NodeFeatureRule',
};

export const NodeFeatureModel: K8sGroupVersionKind = {
  group: 'nfd.k8s-sigs.io',
  version: 'v1alpha1',
  kind: 'NodeFeature',
};

export interface NodeFeatureDiscovery extends K8sResourceCommon {
  spec?: {
    operand?: {
      image?: string;
      imagePullPolicy?: string;
      namespace?: string;
      [key: string]: unknown;
    };
    workerConfig?: {
      configData?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  status?: {
    conditions?: Array<{ type: string; status: string; reason?: string; message?: string }>;
    [key: string]: unknown;
  };
}

export interface NodeFeatureRule extends K8sResourceCommon {
  spec?: {
    rules?: Array<{
      name?: string;
      labels?: Record<string, string>;
      matchFeatures?: unknown;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  };
  status?: {
    [key: string]: unknown;
  };
}

export interface NodeFeature extends K8sResourceCommon {
  spec?: {
    features?: {
      attributes?: Record<string, unknown>;
      flags?: Record<string, unknown>;
      instances?: Record<string, unknown>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  status?: {
    [key: string]: unknown;
  };
}
