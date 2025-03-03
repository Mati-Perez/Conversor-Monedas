/// <reference types="Cypress" />

const URL='192.168.56.1:8080';

context('Conversor de Monedas',()=>{

  beforeEach(()=>{
    cy.visit(URL);
  });

  describe('Probar API y las distintas opciones de moneda',()=>{

    it('Debe manejar errores si la API falla', () => {
      cy.intercept('GET', `https://api.exchangeratesapi.io/v1/symbols?access_key = ${API_KEY}`, { statusCode: 500 }).as('getOpcionesError');

      cy.visit('/');
      cy.wait('@getOpcionesError');
      cy.get('#error').should('be.visible').and('have.text', 'No se pudieron cargar las opciones.');
    });

    it('Debe agregar monedas al select despues de cargar la pagina', ()=>{
      cy.get('#entrada').find('option').should('have.length', '171');
      cy.get('#salida').find('option').should('have.length', '171');
    });

  });


  describe('convierte una moneda a otra', ()=>{

    it('Debe mostrar un error si se introduce un valor vacio', ()=>{
      cy.get('#convertir').click();

      cy.get('#error').should('have.text','La valor de la moneda no puede estar vacio.');
    });

    it('Debe mostrar un error si se introduce un valor menor a 0', ()=>{
      cy.get('#monedaAConvertir').type('-500');

      cy.get('#convertir').click();

      cy.get('#error').should('have.text','El valor de la moneda no puede ser menor a 0');
    });

    it('Debe mostrar un error si no se selecciona una moneda base por convertir', ()=>{
      cy.get('#monedaAConvertir').type('5000.0');

      cy.get('#convertir').click();

      cy.get('#error').should('have.text','Debe de seleccionar una moneda base');
    });

    it('Debe mostrar un error si no se selecciona una moneda destino a convertir', ()=>{
      cy.get('#monedaAConvertir').type('5000.0');
      cy.get('#entrada').select('ARS');
      //cy.get('#entrada').select('ARS');
      cy.get('#convertir').click();

      cy.get('#error').should('have.text','Debe de seleccionar una moneda para convertir');
    });

    it('testea la funcionalidad del conversor de monedas',()=>{
      cy.get('#monedaAConvertir').type('5000.0');
      //cy.get('#entrada').select('ARS');
      //cy.get('#salida').select('USD');
      cy.get('#entrada').select('ARS');
      cy.get('#salida').select('USD');

      cy.get('#convertir').click();

      cy.get('#monedaConvertida').invoke('text').should('not.be.enpty');
    });



    
  });



})