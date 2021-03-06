var assert = require("assert");
var expect = require("expect.js");
var application = require("../lib/application");

describe('standard inheritance', function(){
  var std = {};
  beforeEach(function(){
    var desc = std;
    desc.FurryAnimal = function FurryAnimal(name){
      var self = this;
      this.m_name = name;
      this.sayName = function(){return self.m_name;};
    };
    desc.Feline = function Feline(name){
      var self = this;
      desc.FurryAnimal.call(this,name);
    };
    desc.Cat = function Cat(name){
      var self = this;
      desc.Feline.apply(this,arguments);
    };
  });
  describe('rat', function(){
    beforeEach(function(){
      std.animal = new std.FurryAnimal("rat");
    });
    it("animal should say rat", function(){
      expect(std.animal.sayName()).to.equal("rat");
    });
    it("rat should have type", function(){
      expect(application.getName(std.animal)).to.equal("FurryAnimal");
    });
  });
  describe('lion', function(){
    beforeEach(function(){
      std.lion = new std.Feline("lion");
    });
    it("should say lion", function(){
      expect(std.lion.sayName()).to.equal("lion");
    });
    it("should despite redefining 'this' say lion", function(){
      expect(std.lion.sayName.call({m_name:"red"})).to.equal("lion");
    });
    it("lion should have type", function(){
      expect(application.getName(std.lion)).to.equal("Feline");
    });
  });
  describe('cat', function(){
    beforeEach(function(){
      std.cat = new std.Cat("missan");
    });
    it("should say missan", function(){
      expect(std.cat.sayName()).to.equal("missan");
    });
    it("cat should have type", function(){
      expect(application.getName(std.cat)).to.equal("Cat");
    });
  });
});
describe('prototype', function(){
  var prt = {};
  describe('animal', function(){
    beforeEach(function(){
      var desc = prt;
      desc.FurryAnimal = function FurryAnimal(name){
        this.m_name = name;
      };
      desc.FurryAnimal.prototype.sayName = function(){return this.m_name;};

      desc.Feline = function Feline(name){
        var self = this;
        desc.FurryAnimal.call(this,name);
      };
      desc.Feline.prototype = Object.create(desc.FurryAnimal.prototype);
      desc.Feline.prototype.constructor = desc.Feline;
      desc.Cat = function Cat(name){
        var self = this;
        desc.Feline.apply(this,arguments);
      };
      desc.Cat.prototype = Object.create(desc.Feline.prototype);
      desc.Cat.prototype.constructor = desc.Cat;

      desc.Animal = function Animal(name){
        var self = this;
        this.m_name = name;
        this.sayName = function(){return self.m_name;};
      };
    });
    it("protect", function(){
      var desc = prt;
      var animal = application.protectThis(new desc.Animal("animal"));
      expect(animal.sayName.call({m_name:"name"})).to.equal("animal");
    });
    describe('rat', function(){
      beforeEach(function(){
        prt.animal = new prt.FurryAnimal("rat");
      });
      it("animal should say rat", function(){
        expect(prt.animal.sayName()).to.equal("rat");
      });
      it("rat should have type", function(){
        expect(application.getName(prt.animal)).to.equal("FurryAnimal");
      });
      it("rat should be instance of", function(){
        expect(prt.animal instanceof prt.FurryAnimal).to.equal(true);
      });
    });
    describe('lion', function(){
      beforeEach(function(){
        prt.lion = new prt.Feline("lion");
      });
      it("should say lion", function(){
        expect(prt.lion.sayName()).to.equal("lion");
      });
      it("should when redefining 'this' say red", function(){
        expect(prt.lion.sayName.call({m_name:"red"})).to.equal("red");
      });
      it("lion should have type", function(){
        expect(application.getName(prt.lion)).to.equal("Feline");
      });
      it("lion should be instance of", function(){
        expect(prt.lion instanceof prt.FurryAnimal).to.equal(true);
        expect(prt.lion instanceof prt.Feline).to.equal(true);
      });
    });
    describe('cat', function(){
      beforeEach(function(){
        prt.cat = new prt.Cat("missan");
      });
      it("should say missan", function(){
        expect(prt.cat.sayName()).to.equal("missan");
      });
      it("cat should have type", function(){
        expect(application.getName(prt.cat)).to.equal("Cat");
      });
    });
  });
  describe('self', function(){
    var slf = {};
    beforeEach(function(){
      var desc = slf;
      desc.SpineLess = function SpineLess(name){
        //this.m_name = name;
        this.getSelf().m_name = name;
      };
      desc.SpineLess.prototype = new (function(){
        var self = this;//Since were working in a prototype, this isnt safe.
        this.m_name = "none";
        this.sayName = function(){return self.m_name;};
        this.getSelf = function(){return self;};//The danger of prototype inheritance
      })();
      //Object.create(
    });

      /*app.protectThis*/
      describe('mollusc', function(){
        beforeEach(function(){
          slf.mollusc = new slf.SpineLess("mollusc");
          slf.annelid = new slf.SpineLess("annelid");
        });
        it("mollusc should say annelid!", function(){
          expect(slf.mollusc.sayName()).to.equal("annelid");
        });
        it("annelid should say annelid", function(){
          expect(slf.annelid.sayName()).to.equal("annelid");
        });
        it("mollusc should be able to change name of annelid", function(){
          slf.mollusc.getSelf().m_name = "mollusc";
          expect(slf.annelid.sayName()).to.equal("mollusc");
        });
      });
  });
});

describe('app', function(){
  var app = {};
  beforeEach(function(){
    var desc = app;
    desc.Animal = function(){
      this.breathes = true;
      this.walk = false;
      this.dowalk = function(){
        this.walk = true;
      };
    };
  });
  describe('Animal', function(){
    it('Animal class should exist', function(){
      expect(app.Animal).to.not.be(undefined);
    });
    it("Animal class should be constructable", function(){
      var a = new app.Animal();
      expect((a instanceof app.Animal)).to.equal(true);
    });
    it("Animal class should require new", function(){
      try {
        var a = app.Animal();
      }
      catch (e) {
        expect((e instanceof TypeError)).to.equal(true);
      }
    });
    it("Animal object should breath", function(){
      var a = new app.Animal();
      expect((a.breathes)).to.equal(true);
    });
    it("Animal object should be able to walk", function(){
      var a = new app.Animal();
      a.dowalk();
      expect((a.walk)).to.equal(true);
    });
    describe("feline", function(){
      beforeEach(function(){
        var desc = app;
        desc.Feline = function(){
          desc.Animal.call(this);
          this.claws = true;
          this.furry = true;
          this.says = function() {
            console.log ('GRRRRR');
          };
          this.declaw = function() {
            this.claws = false;
          };
        };
      });
      it("Feline class should be constructable", function(){
        var f = new app.Feline();
        expect((f instanceof app.Feline)).to.equal(true);
      });
      it("Feline object should breath", function(){
        var f = new app.Feline();
        expect((f.breathes)).to.equal(true);
      });
      it("Feline object should have claws and be furry", function(){
        var f = new app.Feline();
        expect(f.claws).to.equal(true);
        expect(f.furry).to.equal(true);
      });
      it("Should be able to declaw a feline object", function(){
        var f = new app.Feline();
        var f2 = new app.Feline();
        f.declaw();
        expect(f.claws).to.equal(false);
        expect(f2.claws).to.equal(true);
      });
      it("Should be able to declaw a feline object despite redefining this", function(){
        var f = application.protectThis(new app.Feline());
        f.declaw.call({claws:true});
        expect((f.claws)).to.equal(false);
      });
      it("Feline object should be able to walk", function(){
        var a = new app.Feline();
        a.dowalk();
        expect(a.walk).to.equal(true);
      });
    });
  });
});

describe('override', function(){
  var ovr = {};
  beforeEach(function(){
    var desc = ovr;
    desc.FurryAnimal = function (name){
      var self = this;
      this.m_name = name;
      this.sayName = function(){return self.m_name;};
      this.say = function(that){return that;};
    };
    desc.Feline = function (name){
      var self = this;
      desc.FurryAnimal.call(this,name);
      application.override(self,'sayName',function(){ return "Feline: "+this();});
      application.override(self,'say',function(that){ return "Feline: "+this(that);});
    };
    desc.Cat = function(name){
      var self = this;
      desc.Feline.apply(this,arguments);
      application.override(self,'sayName',function(){ return "Cat: "+this();});
      application.override(self,'say',function(that){ return "Cat: "+this(that);});
    };
  });
  describe('rat', function(){
    beforeEach(function(){
      ovr.animal = new ovr.FurryAnimal("rat");
    });
    it("animal should say rat", function(){
      expect(ovr.animal.sayName()).to.equal("rat");
    });
  });
  describe('lion', function(){
    beforeEach(function(){
      ovr.lion = new ovr.Feline("lion");
    });
    it("should say lion", function(){
      expect(ovr.lion.sayName()).to.equal("Feline: lion");
      expect(ovr.lion.say('lion')).to.equal("Feline: lion");
    });
    it("should despite redefining 'this' say lion", function(){
      expect(ovr.lion.sayName.call({m_name:"red"})).to.equal("Feline: lion");
      expect(ovr.lion.say.call({m_name:"red"},'lion')).to.equal("Feline: lion");
    });
  });
  describe('cat', function(){
    beforeEach(function(){
      ovr.cat = new ovr.Cat("missan");
    });
    it("should say missan", function(){
      expect(ovr.cat.sayName()).to.equal("Cat: Feline: missan");
      expect(ovr.cat.say('missan')).to.equal("Cat: Feline: missan");
    });
  });
});
