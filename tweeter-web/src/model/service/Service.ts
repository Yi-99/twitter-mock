import { ServerFacade } from "../../network/ServerFacade";

export class Service {
	private _sf: ServerFacade;

	public constructor() {
		this._sf = new ServerFacade();
	}

	public get sf(): ServerFacade {
		return this._sf;
	}
}