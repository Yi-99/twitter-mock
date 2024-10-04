export interface View {

}

export class Presenter {
	private _view: View;

	protected constructor(view: View) {
		this._view = view;
	}

	protected get view(): View {
		return this._view;
	}
}