function PageBackground({ business }) {

  return (
    <div
      className={`menu-page-bg ${business.banner_url ? "" : "no-image"}`}
      style={{
        backgroundImage: business.banner_url
          ? `url(${business.banner_url})`
          : "none",
      }}
    />
  )
}

export default PageBackground