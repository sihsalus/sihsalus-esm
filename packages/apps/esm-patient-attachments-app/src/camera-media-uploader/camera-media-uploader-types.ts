import { type UploadedFile, type FetchResponse } from '@openmrs/esm-framework';

export interface CameraMediaUploaderContextType {
  multipleFiles?: boolean;
  collectDescription?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveFile?: (file: UploadedFile) => Promise<FetchResponse<any>>;
  closeModal?: () => void;
  onCompletion?: () => void;
  filesToUpload?: Array<UploadedFile>;
  setFilesToUpload?: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  uploadFilesToServer?: boolean;
  setUploadFilesToServer?: React.Dispatch<React.SetStateAction<boolean>>;
  clearData?: () => void;
  handleTakePhoto?: (fileBlob: string) => void;
  cameraOnly?: boolean;
  error?: Error;
  setError?: React.Dispatch<React.SetStateAction<Error>>;
  allowedExtensions?: Array<string> | undefined;
}
