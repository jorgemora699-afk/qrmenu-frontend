function MenuHero({ business }) {
  return (
    <div className="menu-hero">
      {business.logo_url && (
        <img
          src={business.logo_url}
          alt={business.name}
          className="hero-logo"
        />
      )}

      <h1 className="hero-title">
        {business.name}
      </h1>

      {business.tagline && (
        <p className="hero-tagline">
          {business.tagline}
        </p>
      )}

      <span className="hero-rule" />
    </div>
  )
}

export default MenuHero