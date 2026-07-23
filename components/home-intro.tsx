export function HomeIntro() {
  return (
    <main className="home" id="main-content">
      <div aria-hidden="true" className="home__ambient">
        <span className="home__orb" />
        <span className="home__line home__line--one" />
        <span className="home__line home__line--two" />
      </div>

      <section aria-labelledby="home-title" className="home__content">
        <p className="eyebrow home__eyebrow">
          <span aria-hidden="true" />
          DOCUMENTAÇÃO OFICIAL
        </p>
        <h1 id="home-title">Documentação do GoDocs</h1>
        <p className="home__description">
          Encontre guias, conceitos e instruções para utilizar o GoDocs.
        </p>
        <p className="home__status">
          <span aria-hidden="true" className="home__status-marker" />
          Novos conteúdos serão publicados progressivamente.
        </p>
      </section>
    </main>
  );
}
