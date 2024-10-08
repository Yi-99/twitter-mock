interface Props {
  setAlias: (alias: string) => void,
  setPassword: (password: string) => void,
	onEnter: (event: React.KeyboardEvent<HTMLElement>) => void
}

const AuthenticationField = (props: Props) => {  
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onChange={(event) => props.setAlias(event.target.value)}
					onKeyDown={(event) => props.onEnter(event)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          placeholder="Password"
          onChange={(event) => props.setPassword(event.target.value)}
					onKeyDown={(event) => props.onEnter(event)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
}

export default AuthenticationField;