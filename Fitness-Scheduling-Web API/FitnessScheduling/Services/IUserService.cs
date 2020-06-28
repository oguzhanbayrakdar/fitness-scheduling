using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using FitnessScheduling.Data;
using FitnessScheduling.Helpers;
using FitnessScheduling.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace FitnessScheduling.Services
{
    public interface IUserService
    {
        User AuthenticateUser(string eMail, string password);
        Owner AuthenticateOwner(string eMail, string password);
    }

    public class UserService : IUserService
    {
        private readonly AppSettings _appSettings;
        private UserRepository _userRepo; // dependency injection yap.
        public UserService(IOptions<AppSettings> appSettings, UserRepository userRepo)
        {
            _userRepo = userRepo;
            _appSettings = appSettings.Value;
        }

        public User AuthenticateUser(string eMail, string password)
        {
            var user = _userRepo.GetUser(eMail, password);

            if (user == null)
            {
                return null;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Role,user.Role) 
                }),
                Expires = DateTime.UtcNow.AddYears(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);
            user.Password = null;

            return user;
        }

        public Owner AuthenticateOwner(string eMail, string password)
        {
            var owner = _userRepo.GetOwner(eMail, password);

            if (owner == null)
            {
                return null;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Role,owner.Role)
                }),
                Expires = DateTime.UtcNow.AddYears(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            owner.Token = tokenHandler.WriteToken(token);
            owner.Password = null;

            return owner;
        }

    }
}
