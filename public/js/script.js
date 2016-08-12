window.onload=init;



//Onload Init Application
function init(){
		var user_cards=localStorage.getItem("github_user");
		user_cards=JSON.parse(user_cards);
		var  app=new GithubApp(user_cards);
		
}


//NameSpaced App
(function(){

	var GithubApp=function(userlists){
		this.data=userlists || [];
		this.BaseURL="https://api.github.com/users/";
		// Retrieve the template data from the HTML (jQuery is used here).
		template = $('#handlebars-demo').html();
		// Compile the template data into a function
		this.templateScript = Handlebars.compile(template);
		this.renderView();
		this.bindEvents();
	
	}

	//Renders View
	GithubApp.prototype.renderView=function(){
		var _this=this;
		var html=_this.templateScript(_this.data);
		// Insert the HTML code into the page
		$("#disp_users").empty();
		$("#disp_users").append(html);
		 localStorage.setItem("github_user", JSON.stringify(_this.data));
		this.bindCardEvents();
	}

	//Bind Component Events 
	GithubApp.prototype.bindEvents = function() {
		var _this=this;
		$("#search_user").on('keyup',function(event){
				if(event.which==13){
					_this.removeAlerts();
					_this.addUser();
				}
		});


		$("#search_btn").on('click',function(event){
					_this.removeAlerts();
					_this.addUser();
		});

		$(".close").on('click',function(event){
				_this.removeAlerts();
		});

		$("#srt_asc_name").on('click',function(event){
			_this.sortNameAscending();
		});

		$("#srt_desc_name").on('click',function(event){
			_this.sortNameDescending();
		});


		$("#srt_asc_location").on('click',function(event){
			_this.sortLocationAscending();
		});

		$("#srt_desc_location").on('click',function(event){
			_this.sortLocationDescending();
		});

		$("#sort_follwers").on('click',function(event){
			_this.sortFollowers();
		});

	}


	GithubApp.prototype.removeAlerts=function(){
		$("#danger_noexist").removeClass("display");
		$("#danger_added").removeClass("display");
		$("#danger_noexist").addClass("display_none");
		$("#danger_added").addClass("display_none");
	}

	//Bind Card Event Handlers
	GithubApp.prototype.bindCardEvents=function(){
		var _this=this;
		$(".cancel_btn").on('click',function(event){
				var removeIndex=_this.data.map(function(x) {return x.login; }).indexOf(this.id);
				if(removeIndex!=-1){
					_this.data.splice(removeIndex,1);
					_this.renderView();

				}
				event.stopPropagation();
		});

		$(".profile-container").on('click',function(event){
			 window.open('https://github.com/'+this.id, '_blank');
		});


	}


	//Add User Data
	GithubApp.prototype.addUser=function(){
		var _this=this;
		$("#preloader").addClass("display");
		var apiurl=_this.BaseURL+$("#search_user").val();
		  $.ajax({
		  	 context: _this,
		      url:apiurl,
		      success:_this.createUser,
		      error:_this.displayError
	   	 })
	};


	//Display Error on Ajax req.
	GithubApp.prototype.displayError=function(){
		$("#preloader").removeClass("display");
		$("#preloader").addClass("display_none");
		$("#danger_noexist").addClass("display");

	}


	//Create User object
	GithubApp.prototype.createUser=function(response){
		var _this=this;
		var obj={
			 image: response.avatar_url, 
			 followers: response.followers,
			 location:response.location || "-",
			 name:response.name || "-",
			 login:response.login
		}
		$("#preloader").removeClass("display");
		$("#preloader").addClass("display_none");
		if(_this.data.map(function(x) {return x.login; }).indexOf(obj.login)==-1){
			_this.data.push(obj);
			_this.renderView();
			$("#search_user").val(null);
		}
		else
		{
			$("#danger_added").addClass("display");
		}
	};


	//Sort name Ascending
	GithubApp.prototype.sortNameAscending=function(){
		for(var i=0;i<this.data.length;i++){
			for(var j=i+1;j<this.data.length;j++)
			{
				if(this.data[i].name>this.data[j].name)
				{
					var temp=this.data[i];
					this.data[i]=this.data[j];
					this.data[j]=temp;
				}
			}

		}
			this.renderView();
	}

	//Sort Name Descending
	GithubApp.prototype.sortNameDescending=function(){
		for(var i=0;i<this.data.length;i++){
			for(var j=i+1;j<this.data.length;j++)
			{
				if(this.data[i].name<this.data[j].name)
				{
					var temp=this.data[i];
					this.data[i]=this.data[j];
					this.data[j]=temp;
				}
			}

		}
			this.renderView();
	}



	//Sort location Ascending
	GithubApp.prototype.sortLocationAscending=function(){
		for(var i=0;i<this.data.length;i++){
			for(var j=i+1;j<this.data.length;j++)
			{
				if(this.data[i].location>this.data[j].location)
				{
					var temp=this.data[i];
					this.data[i]=this.data[j];
					this.data[j]=temp;
				}
			}

		}
			this.renderView();
	}



	//Sort Location Descending
	GithubApp.prototype.sortLocationDescending=function(){
		for(var i=0;i<this.data.length;i++){
			for(var j=i+1;j<this.data.length;j++)
			{
				if(this.data[i].location<this.data[j].location)
				{
					var temp=this.data[i];
					this.data[i]=this.data[j];
					this.data[j]=temp;
				}
			}

		}
			this.renderView();
	}


	//Sort Followers Ascscending only
	GithubApp.prototype.sortFollowers=function(){
		for(var i=0;i<this.data.length;i++){
			for(var j=i+1;j<this.data.length;j++)
			{
				if(this.data[i].followers>this.data[j].followers)
				{
					var temp=this.data[i];
					this.data[i]=this.data[j];
					this.data[j]=temp;
				}
			}

		}
			this.renderView();
	}


window.GithubApp=GithubApp;
})();

