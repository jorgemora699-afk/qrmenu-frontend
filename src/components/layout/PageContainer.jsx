import { buildThemeVars } from "../../utils/theme"

function PageContainer({ children, business }) {
  const themeVars = business ? buildThemeVars(business) : {}

  return (
    <div className="page-container" style={themeVars}>
      {children}
    </div>
  )
}

export default PageContainer