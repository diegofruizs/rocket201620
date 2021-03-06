var userEditModule = angular.module('userEditModule');
var UserEditController = ['$i18n', '$freevenModal', 'userEditService', '$scope', 'userPasswordService',
    'Upload', 'mainService','$routeParams',
    function ($i18n, $freevenModal, userEditService, $scope, userPasswordService, Upload, mainService,$routeParams) {
        /**
         * Tip: add here only visual logic
         */

        var self = this;

        self.userEdit = userEditService;

        self.photoProfile = [];

        self.profileFiles = {};

        var img = {"img": self.userEdit.user.avatar}

        self.photoProfile.push(img);

        self.passwordOk = true;

        self.userEditPassword = userPasswordService;

        self.userEdit.getUser($routeParams.idUser);


        self.showEditPasswordPopup = function () {
            self.userEditPassword.showEditPopup();
        };

        self.close = function () {
            userEditService.closeModal();
        };

        self.validateForm = function () {
            if (self.userEdit.user === undefined) {
            } else {
                var typeUser = self.userEdit.user.is_artist;
                if ((typeUser == 'True') && self.passwordOk == true) {
                    var saveArtist = self.validateFieldsArtist();
                    if (saveArtist) {
                        self.uploadFilesAndData();
                        self.saveUser();
                    }
                }
                if ((typeUser == 'False') && self.passwordOk == true) {
                    var saveUser = self.validateFieldsUser();
                    if (saveUser) {
                        self.saveUser();
                    }
                }
            }
        };

        self.validateFieldsArtist = function () {
            if (self.userEdit.user.first_name == undefined
                || self.userEdit.user.last_name == undefined
                || self.userEdit.user.username == undefined
                || self.userEdit.user.email == undefined
                || self.userEdit.user.is_artist == undefined
                || self.userEdit.user.artistic_name == undefined
                || self.userEdit.user.bank_account_number == undefined
                || self.userEdit.user.bank_account_type == undefined
                || self.userEdit.user.bank == undefined
                || self.userEdit.user.address == undefined
                || self.userEdit.user.city == undefined
                || self.userEdit.user.country == undefined
                || self.userEdit.user.telephone_number == undefined
                || self.userEdit.user.birth_date == undefined
            ) {
                return false
            } else {
                return true
            }
        }

        self.validateFieldsUser = function () {
            if (self.userEdit.user.first_name == undefined
                || self.userEdit.user.last_name == undefined
                || self.userEdit.user.username == undefined
                || self.userEdit.user.email == undefined
                || self.userEdit.user.is_artist == undefined
            ) {
                return false
            } else {
                return true
            }
        }


        self.saveUser = function () {
            self.userEdit.saveUser();
        };

        $scope.imageUpload = function (event) {
            self.photoProfile = [];
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                self.profileFiles['image'] = file;
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        }

        $scope.imageIsLoaded = function (e) {
            img = {}
            $scope.$apply(function () {
                img = {"img": e.target.result};
                self.photoProfile.push(img);
            });
        }

        self.uploadFilesAndData = function () {
            var self = this;
            var user = mainService.getUserData();
            self.userEdit.user.avatar = self.profileFiles.image;
            if (self.profileFiles) {
                Upload.upload({
                    url: 'user/artist-update/' + user.id_artist,
                    method: 'PUT',
                    data: self.userEdit.user
                }).progress(function (evt) {
                }).success(function (data, status, headers, config) {
                    window.location.reload(true);
                });
            }
        };

    }];

userEditModule.component('userEdit', {
    transclude: true,
    bindings: {
        title: '@'
    },
    controller: UserEditController,
    controllerAs: 'ctrl',
    template: require('./userEdit.html')
});
