/*
 * Mock for @openshift-console/dynamic-plugin-sdk
 *
 * The SDK's components and hooks are only available at runtime via module
 * federation. This file provides minimal stubs so unit tests can render
 * components that depend on SDK exports.
 *
 * When writing tests:
 * - Cast the mock: `const mockHook = useK8sModel as jest.Mock;`
 * - Override per-test: `mockHook.mockReturnValue([...]);`
 */
import type * as SDK from '@openshift-console/dynamic-plugin-sdk';

export const ListPageHeader: typeof SDK.ListPageHeader = ({ title }) => <h1>{title}</h1>;

export const DocumentTitle: typeof SDK.DocumentTitle = () => null;

export const useK8sModel = jest.fn(() => [undefined, true]);

export const useK8sWatchResource = jest.fn(() => [[], true, undefined]);

export const useActiveNamespace = jest.fn(() => ['test-namespace', jest.fn()]);

export const useDeleteModal = jest.fn(() => jest.fn());
