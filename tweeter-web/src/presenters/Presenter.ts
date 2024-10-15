export interface View {
	displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
	displayInfoMessage: (message: string, duration: number) => void;
	clearLastInfoMessage: () => void;
}

export class Presenter<V extends View> {
	protected _view: V;

	protected constructor(view: V) {
		this._view = view;
	}

	protected get view() {
		return this._view
	}

	protected async doFailureReportingOp(operation: () => Promise<void>, opDescription: string): Promise<void> {
    try {
			await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${opDescription} because of exception: ${(error as Error).message}`
      );
    }
	}
}