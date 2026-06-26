function PageBackground({ business }) {
  const primary = business.primary_color || "#222222"

  return (
    <div
      className={`menu-page-bg ${business.banner_url ? "" : "no-image"}`}
      style={{
        backgroundImage: business.banner_url
          ? `url(${business.banner_url})`
          : "none",
        "--biz-primary": primary,
      }}
    />
  )
}

export default PageBackground