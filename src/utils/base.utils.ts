import { appConfig } from "@config"

export const getEnvValue = (values: {
  development: string;
  production?: string;
}): string => {
    const { development, production } = values
    switch (appConfig().node) {
    case "production" : return production
    default: return development
    }
}
