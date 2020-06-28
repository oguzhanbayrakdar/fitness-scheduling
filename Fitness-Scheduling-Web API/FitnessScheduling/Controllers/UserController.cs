using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FitnessScheduling.Data;
using FitnessScheduling.Models;
using FitnessScheduling.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace FitnessScheduling.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService _userService;
        private UserRepository _userRepository;
        private FsDataContext _fsDataContext;
        public UserController(IUserService userService, UserRepository userRepository, FsDataContext fsDataContext)
        {
            _userService = userService;
            _userRepository = userRepository;
            _fsDataContext = fsDataContext;
        }

        [HttpPost("RegisterUser")]
        [AllowAnonymous]
        public IActionResult RegisterUser(UserRegister userRegister)
        {
            var addUser = _userRepository.AddUser(userRegister);
            if (addUser == null)
            {
                return BadRequest("An Error Occurred While Registering the User.");
            }

            return Ok(addUser);
        }

        [HttpPost("LoginUser")]
        [AllowAnonymous]
        public IActionResult LoginUser(UserLogin userLogin)
        {
            var user = _userService.AuthenticateUser(userLogin.Email, userLogin.Password);
            if (user == null)
            {
                return BadRequest("Invalid Email or Password.");
            }
            return Ok(user);
        }

        [HttpPost("UpdateUser")]
        public IActionResult UpdateUser(User user)
        {
            var _user = _userRepository.GetUserById(user.Id);
            if (_user == null)
            {
                return BadRequest("An Error Occurred While ");
            }
            var result = _userRepository.UpdateUser(_user, user);

            return result == 1 ? (IActionResult) Ok(_user) : BadRequest("");
        }

        [HttpPost("ChangeUserPassword")]
        public IActionResult ChangeUserPassword([FromBody]JObject data)
        {
            var userId = data.Value<string>("userId");
            var password = data.Value<string>("password");
            var oldPassword = data.Value<string>("oldPassword");


            var user = _userRepository.ChangeUserPassword(new Guid(userId), password, oldPassword);
            if (user == null)
            {
                return BadRequest("An Error Occurred While Changing Password.");
            }
            user.Password = null;

            return Ok(user);
        }

        [HttpGet("GetUserById")]
        public IActionResult GetUserById(Guid userId)
        {
            var user =_userRepository.GetUserById(userId);
            if (user == null)
            {
                return BadRequest("An Error Occurred While Fetching Data.");
            }

            return Ok(user);
        }

        [HttpPost("VerificateUser")]
        [AllowAnonymous]
        public IActionResult VerificateUser([FromBody]JObject data)
        {
            var code = data.Value<string>("code");
            var userId = data.Value<string>("userId");

            var place = _fsDataContext.Places.FirstOrDefault(c => c.VerificationCode == code);
            var user = _fsDataContext.Users.FirstOrDefault(c => c.Id == new Guid(userId));

            if (place == null || user == null)
            {
                return BadRequest();
            }

            user.Place = place;
            user.IsUserVerificated = true;
            _fsDataContext.Entry(user).State = EntityState.Modified;
            _fsDataContext.SaveChanges();

            return Ok(user);
        }

        [HttpPost("checkUsersPasswordIsCorrect")]
        [Authorize]
        public IActionResult CheckUsersPasswordIsCorrect([FromBody] JObject data)
        {
            var id = data.Value<string>("id");
            var password = data.Value<string>("p");

            if (password == null)
            {
                return BadRequest(false);
            }

            var user = _userRepository.GetUserById(new Guid(id));
            if (user == null)
            {
                return BadRequest(false);
            }

            if (user.Password == password)
            {
                return Ok(true);
            }

            return BadRequest(false);
        }
        [HttpPost("checkPlacesPasswordIsCorrect")]
        [Authorize]
        public IActionResult CheckPlacesPasswordIsCorrect([FromBody] JObject data)
        {
            var id = data.Value<string>("id");
            var password = data.Value<string>("p");

            if (password == null)
            {
                return BadRequest(false);
            }

            var place = _userRepository.GetPlaceByOwnerId(new Guid(id));
            if (place == null)
            {
                return BadRequest(false);
            }

            if (place.Owner.Password == password)
            {
                return Ok(true);
            }

            return BadRequest(false);
        }

        
        [HttpPost("ForgotPass")]
        public IActionResult ForgotPass(string eMail)
        {

            return Ok("Forgot Pass is ok");
        }

        [HttpPost("RegisterBusiness")]
        [AllowAnonymous]
        public IActionResult RegisterBusiness(PlaceRegister placeRegister)
        {
            var addBusiness = _userRepository.AddBusiness(placeRegister);

            if (addBusiness == null)
            {
                return BadRequest("An Error Occurred While Registering The User.");
            }

            addBusiness.Password = null;
            return Ok(addBusiness);
        }

        [HttpPost("LoginBusiness")]
        [AllowAnonymous]
        public IActionResult LoginBusiness(PlaceLogin placeLogin)
        {
            var owner = _userService.AuthenticateOwner(placeLogin.Email, placeLogin.Password);
            if (owner == null)
            {
                return BadRequest("Invalid Email or Password");
            }

            return Ok(owner);
        }

        [HttpPost("UpdatePlace")]
        [Authorize]
        public IActionResult UpdateBusiness(Place place)
        {
            var _place = _userRepository.GetPlaceByOwnerId(place.Owner.Id);
            if (_place == null)
            {
                return BadRequest(null);
            }

            var result = _userRepository.UpdatePlace(place);
            if (result != 0)
            {
                return Ok( _place);
            }
            return BadRequest(null);
        }

        [HttpPost("ChangeBusinessPassword")]
        [Authorize]
        public IActionResult ChangeBusinessPassword([FromBody]JObject data)
        {
            var ownerId = data.Value<string>("ownerId");
            var password = data.Value<string>("password");
            var oldPassword = data.Value<string>("oldPassword");

            var place = _userRepository.ChangePlacePassword(new Guid(ownerId), password, oldPassword);
            if (place == null)
            {
                return BadRequest("An Error Occurred While Changing Password.");
            }
            place.Owner.Password = null;

            return Ok(place);
        }


        [HttpGet("GetPlaceById")]
        [Authorize]
        public IActionResult GetBusinessById(Guid ownerId)
        {
            var place = _userRepository.GetPlaceByOwnerId(ownerId);
            if (place == null)
            {
                return BadRequest("An Error Occurred While Fetching Data.");
            }

            return Ok(place);
        }
    }
}