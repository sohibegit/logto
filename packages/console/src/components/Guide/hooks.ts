import { ApplicationType } from '@logto/schemas';
import { useCallback, useMemo, useContext } from 'react';

import { guides } from '@/assets/docs/guides';
import { type Guide } from '@/assets/docs/guides/types';
import { isCloud as isCloudEnv, isDevFeaturesEnabled } from '@/consts/env';
import { SubscriptionDataContext } from '@/contexts/SubscriptionDataProvider';
import {
  thirdPartyAppCategory,
  type AppGuideCategory,
  type StructuredAppGuideMetadata,
} from '@/types/applications';

const defaultStructuredMetadata: StructuredAppGuideMetadata = {
  featured: [],
  Traditional: [],
  SPA: [],
  Native: [],
  MachineToMachine: [],
  Protected: [],
  SAML: [],
  ThirdParty: [],
};

type FilterOptions = {
  categories?: AppGuideCategory[];
  keyword?: string;
};

export const useApiGuideMetadata = () =>
  guides.filter(({ metadata: { target } }) => target === 'API');

export const useAppGuideMetadata = (): {
  getFilteredAppGuideMetadata: (filters?: FilterOptions) => readonly Guide[];
  getStructuredAppGuideMetadata: (
    filters?: FilterOptions
  ) => Record<AppGuideCategory, readonly Guide[]>;
} => {
  const { currentSubscriptionQuota } = useContext(SubscriptionDataContext);

  const appGuides = useMemo(
    () =>
      guides
        .filter(
          ({ metadata: { target, isCloud, isDevFeature } }) =>
            target !== 'API' && (isCloudEnv || !isCloud) && (isDevFeaturesEnabled || !isDevFeature)
          /**
           * Show SAML guides when it is:
           * 1. Cloud env
           * 2. `isDevFeatureEnabled` is true
           * 3. `quota.samlApplicationsLimit` is not 0.
           */
        )
        .filter(
          ({ metadata: { target } }) =>
            target !== ApplicationType.SAML ||
            (isCloudEnv &&
              isDevFeaturesEnabled &&
              currentSubscriptionQuota.samlApplicationsLimit !== 0)
        ),
    []
  );

  const getFilteredAppGuideMetadata = useCallback(
    (filters?: FilterOptions) => {
      const { categories: filterCategories, keyword } = filters ?? {};
      // If no filter is applied, return all metadata
      if (!filterCategories?.length && !keyword) {
        return appGuides;
      }

      // Keyword only, return partial name matched result
      if (keyword && !filterCategories?.length) {
        return appGuides.filter(({ metadata: { name } }) =>
          name.toLowerCase().includes(keyword.toLowerCase())
        );
      }

      // Categories only, return selected categories
      if (!keyword && filterCategories?.length) {
        return appGuides.filter(({ metadata: { target, isFeatured, isThirdParty } }) =>
          filterCategories.some((filterCategory) => {
            return (
              filterCategory === target ||
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              (isFeatured && filterCategory === 'featured') ||
              (isThirdParty && filterCategory === 'ThirdParty')
            );
          })
        );
      }

      // Keyword and categories, return partial name matched result in selected categories
      if (keyword && filterCategories?.length) {
        return appGuides.filter(
          ({ metadata: { name, target, isFeatured } }) =>
            name.toLowerCase().includes(keyword.toLowerCase()) &&
            filterCategories.some(
              (filterCategory) =>
                filterCategory === target || (isFeatured && filterCategory === 'featured')
            )
        );
      }
      return [];
    },
    [appGuides]
  );

  const getStructuredAppGuideMetadata = useCallback(
    (filters?: FilterOptions) => {
      const filteredMetadata = getFilteredAppGuideMetadata(filters);

      return filteredMetadata.reduce((accumulated, guide) => {
        const { target, isFeatured, isThirdParty } = guide.metadata;

        // Rule out API target guides to make TypeScript happy
        if (target === 'API') {
          return accumulated;
        }

        if (isThirdParty) {
          return {
            ...accumulated,
            [thirdPartyAppCategory]: [...accumulated[thirdPartyAppCategory], guide],
          };
        }

        return {
          ...accumulated,
          [target]: [...accumulated[target], guide],
          ...(isFeatured && {
            featured: [...accumulated.featured, guide],
          }),
        };
      }, defaultStructuredMetadata);
    },
    [getFilteredAppGuideMetadata]
  );

  return { getFilteredAppGuideMetadata, getStructuredAppGuideMetadata };
};
