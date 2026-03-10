import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/console-types';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export const PipelineModel: K8sGroupVersionKind = {
  group: 'tekton.dev',
  version: 'v1',
  kind: 'Pipeline',
};

export const PipelineRunModel: K8sGroupVersionKind = {
  group: 'tekton.dev',
  version: 'v1',
  kind: 'PipelineRun',
};

export const TaskModel: K8sGroupVersionKind = {
  group: 'tekton.dev',
  version: 'v1',
  kind: 'Task',
};

export const TaskRunModel: K8sGroupVersionKind = {
  group: 'tekton.dev',
  version: 'v1',
  kind: 'TaskRun',
};

export const TektonConfigModel: K8sGroupVersionKind = {
  group: 'operator.tekton.dev',
  version: 'v1alpha1',
  kind: 'TektonConfig',
};

export interface Pipeline extends K8sResourceCommon {
  spec?: {
    tasks?: Array<{
      name?: string;
      taskRef?: { name?: string; kind?: string };
      [key: string]: unknown;
    }>;
    params?: Array<{ name?: string; type?: string; default?: unknown }>;
    [key: string]: unknown;
  };
  status?: {
    conditions?: Array<{ type: string; status: string; reason?: string; message?: string }>;
    [key: string]: unknown;
  };
}

export interface PipelineRun extends K8sResourceCommon {
  spec?: {
    pipelineRef?: { name?: string };
    params?: Array<{ name?: string; value?: unknown }>;
    [key: string]: unknown;
  };
  status?: {
    conditions?: Array<{ type: string; status: string; reason?: string; message?: string }>;
    startTime?: string;
    completionTime?: string;
    [key: string]: unknown;
  };
}

export interface Task extends K8sResourceCommon {
  spec?: {
    steps?: Array<{
      name?: string;
      image?: string;
      command?: string[];
      [key: string]: unknown;
    }>;
    params?: Array<{ name?: string; type?: string; default?: unknown }>;
    [key: string]: unknown;
  };
  status?: {
    conditions?: Array<{ type: string; status: string; reason?: string; message?: string }>;
    [key: string]: unknown;
  };
}

export interface TaskRun extends K8sResourceCommon {
  spec?: {
    taskRef?: { name?: string; kind?: string };
    params?: Array<{ name?: string; value?: unknown }>;
    [key: string]: unknown;
  };
  status?: {
    conditions?: Array<{ type: string; status: string; reason?: string; message?: string }>;
    startTime?: string;
    completionTime?: string;
    [key: string]: unknown;
  };
}

export interface TektonConfig extends K8sResourceCommon {
  spec?: {
    profile?: string;
    targetNamespace?: string;
    [key: string]: unknown;
  };
  status?: {
    conditions?: Array<{ type: string; status: string; reason?: string; message?: string }>;
    version?: string;
    [key: string]: unknown;
  };
}
