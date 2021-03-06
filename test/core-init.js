var expect = require('chai').expect;
var cytoscape = require('../build/cytoscape.js', cytoscape);
var $;

try {
  $ = require('jQuery');
} catch(err){}

describe('Core initialisation', function(){

  it('does not add a node with the same ID as an earlier one', function(done){
    cytoscape({
      elements: {
        nodes: [
          { data: { id: 'n1', foo: 'one' } },
          { data: { id: 'n2', foo: 'two' } },
          { data: { id: 'n1', foo: 'what is this guy doing here' } }
        ]
      }, 
      ready: function(){
        var cy = this;

        expect( cy.elements().size() ).to.equal(2);
        expect( cy.$('#n1').data('foo') ).to.equal('one');
        
        done();
      }
    });
  });

  it('loads ok with empty graph', function(done){
    cytoscape({
      ready: function(){
        var cy = this;

        expect( cy.elements().length ).to.equal(0);
        
        done();
      }
    });
  });

  it('does not create an edge with bad source and target', function(done){
    cytoscape({
      elements: {
        edges: [ { data: { source: "n1", target: "n2" } } ]
      },
      ready: function(){
        var cy = this;

        expect( cy.elements().length ).to.equal(0);
        
        done();
      }
    });
  });

  it('does not create an edge with bad target', function(done){
    cytoscape({
      elements: {
        nodes: [ { data: { id: "n1" } } ],
        edges: [ { data: { source: "n1", target: "n2" } } ]
      },
      ready: function(){
        var cy = this;

        expect( cy.edges().size() ).to.equal( 0 );
        expect( cy.nodes().size() ).to.equal( 1 );

        done();
      }
    });
  });

  it('creates an edge that specifies good source and target', function(done){
    cytoscape({
      elements: {
        nodes: [ { data: { id: "n1" } }, { data: { id: "n2" } } ],
        edges: [ { data: { source: "n1", target: "n2" } } ]
      },
      ready: function(){
        var cy = this;

        expect( cy.edges().size() ).to.equal(1);
        expect( cy.nodes().size() ).to.equal(2);
        
        done();
      }
    });
  });

  it('adds node with self as parent but as parentless node', function(done){
    cytoscape({
      elements: {
        nodes: [ { data: { id: "n1", parent: "n1" } } ]
      },
      ready: function(){
        var cy = this;

        expect( cy.$("#n1").parent().size() ).to.equal(0);
        
        done();
      }
    });
  });

  it('breaks a parent cycle between two nodes', function(done){
    cytoscape({
      elements: {
        nodes: [
          { data: { id: "n1", parent: "n2" } },
          { data: { id: "n2", parent: "n1" } }
        ]
      },
      ready: function(){
        var cy = this;

        expect( cy.$("#n1").parent().parent().length ).to.equal(0);

        done();
      }
    });
  });

  // browser only tests
  if( typeof window !== 'undefined' && $ ){

    it('inits via jquery', function(done){
      $('#cy').cytoscape({
        elements: {
          nodes: [
            { data: { id: "n1" } },
            { data: { id: "n2" } }
          ]
        },
        ready: function(){
          var cy = this;

          expect( cy.$("#n1").length ).to.equal(1);
          expect( cy.$("#n2").length ).to.equal(1);

          done();
        }
      });
    });

    it('gets via jquery', function(done){
      $('#cy').cytoscape({
        elements: {
          nodes: [
            { data: { id: "n1" } },
            { data: { id: "n2" } }
          ]
        },
        ready: function(){
          var cy = this;

          expect( cy ).to.equal( gotCy );

          done();
        }
      });

      var gotCy = $('#cy').cytoscape('get');
    });

    it('overwrites old instance via jquery', function(done){
      var cy1, cy2;
      var cy1DescLen, cy2DescLen;

      function init1(){
        $('#cy').cytoscape({
          elements: {
            nodes: [
              { data: { id: "n1" } },
              { data: { id: "n2" } }
            ]
          },
          ready: function(){
            var cy = cy1 = this;
            cy1DescLen = $('#cy').find('*').length;

            expect( cy.$("#n1").length ).to.equal(1);
            expect( cy.$("#n2").length ).to.equal(1);

            init2();
          }
        });
      }

      function init2(){
        $('#cy').cytoscape({
          elements: {
            nodes: [
              { data: { id: "n3" } },
              { data: { id: "n4" } }
            ]
          },
          ready: function(){
            var cy = cy2 = this;
            cy2DescLen = $('#cy').find('*').length;

            // old eles not there
            expect( cy.$("#n1").length ).to.equal(0);
            expect( cy.$("#n2").length ).to.equal(0);

            // new eles there
            expect( cy.$("#n3").length ).to.equal(1);
            expect( cy.$("#n4").length ).to.equal(1);

            // new instance
            expect( cy1 ).to.not.equal( cy2 );

            // dom eles were removed
            expect( cy1DescLen ).to.equal( cy2DescLen );

            done();
          }
        });
      }

      init1(); // kick off 1st init
    });

    it('overwrites old instance via jquery => plain', function(done){
      var cy1, cy2;
      var cy1DescLen, cy2DescLen;

      function init1(){
        $('#cy').cytoscape({
          elements: {
            nodes: [
              { data: { id: "n1" } },
              { data: { id: "n2" } }
            ]
          },
          ready: function(){
            var cy = cy1 = this;
            cy1DescLen = $('#cy').find('*').length;

            expect( cy.$("#n1").length ).to.equal(1);
            expect( cy.$("#n2").length ).to.equal(1);

            init2();
          }
        });
      }

      function init2(){
        cytoscape({
          container: $('#cy')[0],
          elements: {
            nodes: [
              { data: { id: "n3" } },
              { data: { id: "n4" } }
            ]
          },
          ready: function(){
            var cy = cy2 = this;
            cy2DescLen = $('#cy').find('*').length;

            // old eles not there
            expect( cy.$("#n1").length ).to.equal(0);
            expect( cy.$("#n2").length ).to.equal(0);

            // new eles there
            expect( cy.$("#n3").length ).to.equal(1);
            expect( cy.$("#n4").length ).to.equal(1);

            // new instance
            expect( cy1 ).to.not.equal( cy2 );

            // dom eles were removed
            expect( cy1DescLen ).to.equal( cy2DescLen );

            done();
          }
        });
      }

      init1(); // kick off 1st init
    });

    it('overwrites old instance via plain => jquery', function(done){
      var cy1, cy2;
      var cy1DescLen, cy2DescLen;

      function init1(){
        cytoscape({
          container: $('#cy')[0],
          elements: {
            nodes: [
              { data: { id: "n1" } },
              { data: { id: "n2" } }
            ]
          },
          ready: function(){
            var cy = cy1 = this;
            cy1DescLen = $('#cy').find('*').length;

            expect( cy.$("#n1").length ).to.equal(1);
            expect( cy.$("#n2").length ).to.equal(1);

            init2();
          }
        });
      }

      function init2(){
        $('#cy').cytoscape({
          elements: {
            nodes: [
              { data: { id: "n3" } },
              { data: { id: "n4" } }
            ]
          },
          ready: function(){
            var cy = cy2 = this;
            cy2DescLen = $('#cy').find('*').length;

            // old eles not there
            expect( cy.$("#n1").length ).to.equal(0);
            expect( cy.$("#n2").length ).to.equal(0);

            // new eles there
            expect( cy.$("#n3").length ).to.equal(1);
            expect( cy.$("#n4").length ).to.equal(1);

            // new instance
            expect( cy1 ).to.not.equal( cy2 );

            // dom eles were removed
            expect( cy1DescLen ).to.equal( cy2DescLen );

            done();
          }
        });
      }

      init1(); // kick off 1st init
    });

    it('binds to ready via jquery', function(done){
      var before, after, during;

      function checkDone(){
        if( before && after && during ){
          done();
        }
      }

      $('#cy').cytoscape(function(){
        before = true;
      });

      $('#cy').cytoscape({
        elements: {
          nodes: [
            { data: { id: "n3" } },
            { data: { id: "n4" } }
          ]
        },
        ready: function(){
          during = true;
        }
      });

      $('#cy').cytoscape(function(){
        after = true;
      });

      setTimeout(function(){
        expect( before ).to.be.true;
        expect( after ).to.be.true;
        expect( during ).to.be.true;

        done();
      }, 1000);
    });

  } // end browser only tests

  

});