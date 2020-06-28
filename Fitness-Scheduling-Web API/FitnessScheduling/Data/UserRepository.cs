using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FitnessScheduling.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessScheduling.Data
{
    public class UserRepository
    {
        private FsDataContext _fsDataContext;

        public UserRepository(FsDataContext fsDataContext)
        {
            _fsDataContext = fsDataContext;
        }

        public User GetUserById(Guid userId)
        {
            var user = _fsDataContext.Users.FirstOrDefault(c => c.Id == userId);

            return user;
        }

        public User GetUser(string eMail, string password)
        {
            var user = _fsDataContext.Users.FirstOrDefault(c => c.Password == password && c.EMail == eMail);

            return user;
        }

        public int UpdateUser(User user, User newData)
        {
            user.Name = newData.Name;
            user.LastName = newData.LastName;
            user.EMail = newData.EMail;
            user.Gender = newData.Gender;

            _fsDataContext.Entry<User>(user).State = EntityState.Modified;
            return _fsDataContext.SaveChanges();
        }

        public Owner GetOwner(string eMail, string password)
        {
            var owner = _fsDataContext.Owners.Include(c => c.Place).FirstOrDefault(c => c.Password == password && c.EMail == eMail);

            return owner;
        }

        public Owner AddBusiness(PlaceRegister placeRegister)
        {
            var owner = _fsDataContext.Owners.Any(c => c.EMail == placeRegister.Owner.EMail);

            var invitationCode = GenerateInvitationCode();

            if (owner)
            {
                return null;
            }
            
            var newOwner = new Owner();

            newOwner.Role = Role.Business;
            newOwner.Password = placeRegister.Password;
            newOwner.EMail = placeRegister.Owner.EMail;
            

            newOwner.Place = new Place();
            newOwner.Place.RegistrationDate = DateTime.Today;
            newOwner.Place.Name = placeRegister.Name;
            newOwner.Place.VerificationCode = invitationCode;
            
            _fsDataContext.Owners.Add(newOwner);
            _fsDataContext.SaveChanges();
            return newOwner;
        }

        public User AddUser(UserRegister userRegister)
        {
            var _user = _fsDataContext.Users.Any(c => c.EMail == userRegister.Email);

            if (_user)
            {
                return null;
            }

            var user = new User();

            user.Role = Role.User;
            user.Password = userRegister.Password;
            user.EMail = userRegister.Email;
            user.Name = userRegister.Name;
            user.LastName = userRegister.LastName;

            _fsDataContext.Users.Add(user);
            _fsDataContext.SaveChanges();
            return user;
        }

        public User ChangeUserPassword(Guid userId, string password, string oldPassword)
        {
            var user = _fsDataContext.Users.FirstOrDefault(c => c.Id == userId);
            if (user == null)
            {
                return null;
            }

            if (user.Password != oldPassword)
            {
                return null;
            }

            user.Password = password;
            _fsDataContext.Entry(user).State = EntityState.Modified;
            _fsDataContext.SaveChanges();

            return user;
        }
            
        // Place
        public Place GetPlace(Guid placeId)
        {
            return _fsDataContext.Places.Include(c => c.Owner).FirstOrDefault(c => c.Id == placeId);
        }

        public Place GetPlaceByOwnerId(Guid id)
        {
            return _fsDataContext.Places.Include(c => c.Owner).FirstOrDefault(c => c.OwnerRef == id);
        }

        public int UpdatePlace(Place place)
        {
            var getPlace = _fsDataContext.Places.Include(c => c.Owner).FirstOrDefault(c => c.Owner.Id == place.Owner.Id);

            getPlace.Name = place.Name;
            getPlace.Address = place.Address;

            getPlace.Owner.Name = place.Owner.Name;
            getPlace.Owner.EMail = place.Owner.EMail;
            getPlace.Owner.LastName = place.Owner.LastName;

            getPlace.OffDays = place.OffDays;
            getPlace.OpeningTime = place.OpeningTime;
            getPlace.ClosingTime = place.ClosingTime;
            getPlace.Description = place.Description;
            getPlace.IsFullOpen = place.IsFullOpen;

            _fsDataContext.Entry<Place>(getPlace).State = EntityState.Modified;
            var result = _fsDataContext.SaveChanges();
            return result;
        }

        public Place ChangePlacePassword(Guid ownerId, string password, string oldPassword)
        {
            var place = _fsDataContext.Places.Include(c=>c.Owner).FirstOrDefault(c => c.OwnerRef == ownerId);
            if (place == null)
            {
                return null;
            }

            if (place.Owner.Password != oldPassword)
            {
                return null;
            }

            place.Owner.Password = password;

            _fsDataContext.Entry(place).State = EntityState.Modified;
            _fsDataContext.SaveChanges();

            return place;
        }


        private string GenerateInvitationCode()
        {
            char[] characters = {'A','B','D', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'Y', 'Z'};

            StringBuilder code = new StringBuilder();
            bool isInvitationCodeOk = false;

            do
            {
                code.Clear();

                for (int i = 0; i < 8; i++)
                {
                    var rnd = new Random().Next(0, characters.Length);

                    code.Append(characters[rnd]);
                }

                isInvitationCodeOk = _fsDataContext.Places.Any(c => c.VerificationCode == code.ToString());

            } while (!isInvitationCodeOk);


            return code.ToString();
        }

          
    }

}
