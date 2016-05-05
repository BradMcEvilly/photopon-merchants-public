{% extends "tpl/layout.tpl" %}

{% block content %}




    <div class="bg-white-only">
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-md-offset-2">
            <div class="m-t-xxl m-b-xxl padder-v">
              <h1 class="font-bold l-h-1x m-t-xxl text-black padder-v animated fadeInDown">
                Fill out this form to send merchant request.
              </h1>
               <form name="form" class="form-validation" id="merchantform">
                <div class="panel panel-default">
                  <div class="panel-heading">
                    <span class="h4">Merchant Info</span>
                  </div>
                  <div class="panel-body">

                    <p><strong>Use your existing Photopon account to request merchant access</strong></p>

                    <div class="form-group">
                      <label>Username</label>
                      <input id="username" type="text" class="form-control" required placeholder="Your current Photopon user name">
                    </div>

                    <div class="form-group">
                      <label>Password</label>
                      <input id="password" type="password" class="form-control" required placeholder="Your Photopon account password">
                    </div>

                    <p><strong>Please fill company informaiton. All fields are mandatory.</strong></p>
                    <div class="form-group">
                      <label>Business name</label>
                      <input id="business" type="text" class="form-control" required placeholder="Business name which you represent">
                    </div>
                    <div class="form-group">
                      <label>Phone number</label>
                      <input id="phone" type="text" class="form-control" required placeholder="Business number">
                    </div>
                    <div class="form-group">
                      <label>Tax ID</label>
                      <input id="taxid" type="text" class="form-control" required placeholder="Tax ID of your business">
                    </div>
                    <div class="form-group">
                      <label>Logo</label>
                      <input id="logo" type="file" accept="image/*" required>
                    </div>

                    <div>
                      <span id="errormessage" class="bg-danger"></span>
                    </div>

                  </div>

                  <footer class="panel-footer text-right bg-light lter">
                    <button type="submit" class="btn btn-success">Send Request</button>
                  </footer>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>


{% endblock %}
