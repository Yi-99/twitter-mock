import { Buffer } from "buffer";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
	setImageUrl: (url: string) => void;
	setImageBytes: (bytes: Uint8Array) => void;
	getFileExtension: (file: File) => string | undefined;
	setImageFileExtension: (extension: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter {
	constructor(view: RegisterView) {
		super(view);
	}
	
	protected get view(): RegisterView {
		return this._view as RegisterView;
	}

	public async doRegister(
		firstName: string, 
		lastName: string, 
		alias: string, 
		password: string, 
		imageBytes: Uint8Array, 
		imageFileExtension: string,
		rememberMe: boolean
	) {
    try {
      this.isLoading = true;

      const [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this.isLoading = false;
    }
  };

	public handleImageFile (file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
				console.log("Bytes:", bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.view.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  };
}