using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FitnessScheduling.Models
{
    public class Appointment
    {
        public Guid Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime ApplicationDate { get; set; }
        public string NoteToOwner { get; set; }
        public bool IsApproved { get; set; }
        public bool IsActive { get; set; } // Tarihinin geçmiş olmasına bakar.
        public Guid PlaceId { get; set; }
        public Place Place { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }

        [NotMapped]
        public string FullName { get; set; }

    }
    public class Place
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public DateTime OpeningTime { get; set; }
        public DateTime ClosingTime { get; set; }
        public bool IsFullOpen { get; set; }
        public string OffDays { get; set; }
        //public IList<UserPlace> UserPlaces { get; set; }
        public List<User> Users { get; set; }

        public List<Appointment> Appointments { get; set; }
        public List<Announcement> Announcements { get; set; }
        public Guid OwnerRef { get; set; }
        public Owner Owner { get; set; }
        public DateTime RegistrationDate { get; set; }
        public DateTime MaxAppointmentTime { get; set; }
        public int WeeklyAppointmentLimit { get; set; }
        public string Description { get; set; }
        public string VerificationCode { get; set; }

    }
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public int CurrentAppointmentCount { get; set; }
        public string AnonymousName { get; set; }
        //public IList<UserPlace> UserPlaces { get; set; }

        public Guid PlaceRef  { get; set; }
        public Place Place { get; set; }

        public List<Appointment> Appointments { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string EMail { get; set; }
        public int Gender { get; set; } // 0 Woman / 1 Man / 2 Other
        public string Password { get; set; }
        public string Role { get; set; }
        public bool IsUserVerificated { get; set; }

        public string Token { get; set; }

    }

    public class UserPlace
    {
        public Guid UserId { get; set; }
        public User User { get; set; }

        public Guid PlaceId { get; set; }
        public Place Place { get; set; }
    }
    public class Announcement
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; }
        public Guid PlaceId { get; set; }
        public Place Place { get; set; }
        public bool IsRead { get; set; }
    }
    public class Owner
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string EMail { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }

        public Place Place { get; set; }

        [NotMapped]
        public string Token { get; set; }
    }
}
