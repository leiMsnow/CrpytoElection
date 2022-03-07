App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: async function () {
    return await App.initWeb3();
  },

  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Election.json", function (election) {
      App.contracts.Election = TruffleContract(election);
      // console.log("initContract, Election: " + JSON.stringify(App.contracts.Election));
      App.contracts.Election.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function () {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Current Account:" + account);
      } else {
        console.error("getConbase err:" + err);
      }
    });

    App.contracts.Election.deployed().then(function (instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function (candidatesCount) {
      var candidatesResult = $("#candidatesResult");
      candidatesResult.empty();

      for (let i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function (candidate) {
          let name = candidate[0];
          let id = candidate[1];
          let vote = candidate[2];
          let candidateTemplete = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + vote + "</td></tr>";
          candidatesResult.append(candidateTemplete);
        });
      }

      loader.hide();
      content.show();

    }).catch(function (err) {
      console.error("init contract err:" + err);
    })

  },

  bindEvents: function () {
    // $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function () {
    /*
     * Replace me...
     */
  },

  handleAdopt: function (event) {
    // event.preventDefault();

    // var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
