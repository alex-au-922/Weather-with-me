// create a component so that it has the function of navbar
export default function NavBar(props) {
  return <div>{props.children}</div>;
}

// Usage in other pages: return <NavBar> <Component> </NavBar>
