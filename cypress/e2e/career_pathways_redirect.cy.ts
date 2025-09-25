describe('Career Pathways root redirect', () => {
  it('redirects /health to /career-pathways/healthcare', () => {
    cy.request({ url: '/health', followRedirect: false }).then((res) => {
      expect(res.status).to.eq(308); // middleware redirect
      expect(res.redirectedToUrl).to.match(/\/career-pathways\/healthcare$/);
    });
  });
});