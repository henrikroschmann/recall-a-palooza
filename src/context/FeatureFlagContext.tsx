import React, { ReactNode, useEffect, useState } from "react";

interface FeatureFlags {
  isLocalStorageEnabled?: boolean;
}

const FeatureFlagsContext = React.createContext<FeatureFlags>({});

const FeatureFlagsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [features, setFeatures] = useState<FeatureFlags>({});

  useEffect(() => {
    setFeatures({
      isLocalStorageEnabled: false,
    });
  }, []);

  return (
    <FeatureFlagsContext.Provider value={features}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export { FeatureFlagsContext, FeatureFlagsProvider };
