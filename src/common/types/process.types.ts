import { AnyFile } from "./files.types"

type QueryParameter = string | number;
export type CallbackQueries = Partial<{
  queryAtStart: [string, Array<QueryParameter>];
  queryAtEnd: [string, Array<QueryParameter>];
}>;

export type AnyFileProcessData = {
  assetId: string;
  file: AnyFile;
  callbackQueries?: CallbackQueries;
};

export type FilenameProcessData = {
  assetId: string;
  filename: string;
  callbackQueries?: CallbackQueries;
};
