using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FitnessScheduling.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Bogus;
namespace FitnessScheduling.Models
{
    public class SeedData
    {
        public static void EnsurePopulated(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<FsDataContext>();
                if (!context.Places.Any())
                {
                    // DataExchange(context);
                }
            }
        }
        public static List<User> CreateUsers()
        {
            DateTime firstDate = new DateTime(2020, 1, 4);
            DateTime secondDate = new DateTime(2020, 5, 30);
            List<User> users = new List<User>();
            for (int i = 0; i < 100; i++)
            {

                var testUser = new Faker<User>()
                    .RuleFor(c => c.Id, f => Guid.NewGuid())
                    .RuleFor(c => c.Name, f => f.Name.FirstName())
                    .RuleFor(c => c.LastName, f => f.Name.LastName())
                    .RuleFor(c => c.Password, "1234" + i)
                    .RuleFor(c => c.CurrentAppointmentCount, f => f.Random.Int(0, 4))
                    .RuleFor(c => c.AnonymousName, f => f.Random.AlphaNumeric(7).ToUpper())
                    .RuleFor(c => c.Place, new Place())
                    .RuleFor(c => c.Appointments, new List<Appointment>())
                    .RuleFor(c => c.RegistrationDate, f => f.Date.Between(firstDate, secondDate))
                    .RuleFor(c => c.EMail, (f, u) => f.Internet.Email(u.Name, u.LastName))
                    .RuleFor(c => c.Gender, f => f.Random.Int(0, 2))
                    .RuleFor(c => c.Role, Role.User);

                var user = testUser.Generate();
                users.Add(user);
            }
            return users;
        }

        public static List<Place> CreatePlaces()
        {
            DateTime firstDate = new DateTime(2019, 1, 4);
            DateTime secondDate = new DateTime(2019, 12, 30);

            List<Place> places = new List<Place>();
            for (int i = 0; i < 2; i++)
            {
                var testPlace = new Faker<Place>()
                    .RuleFor(c => c.Id, f => Guid.NewGuid())
                    .RuleFor(c => c.Name, f => f.Company.CompanyName())
                    .RuleFor(c => c.Address, f => f.Address.FullAddress())
                    .RuleFor(c => c.OpeningTime,
                        f => f.Date.Between(new DateTime(1970, 1, 1, 7, 0, 0), new DateTime(2020, 5, 30, 9, 30, 0)))
                    .RuleFor(c => c.ClosingTime,
                        f => f.Date.Between(new DateTime(1970, 1, 1, 22, 0, 0), new DateTime(2020, 5, 30, 23, 30, 0)))
                    .RuleFor(c => c.IsFullOpen, f => f.Random.Bool(.8f))
                    .RuleFor(c => c.Users, new List<User>())
                    .RuleFor(c => c.OffDays, "Pazar")
                    .RuleFor(c => c.Appointments, new List<Appointment>())
                    .RuleFor(c => c.Announcements, new List<Announcement>())
                    .RuleFor(c => c.Owner, new Owner())
                    .RuleFor(c => c.RegistrationDate, f => f.Date.Between(firstDate, secondDate))
                    .RuleFor(c => c.MaxAppointmentTime,
                        f => f.Date.Between(new DateTime(2020, 5, 30, 0, 0, 0), new DateTime(2020, 5, 30, 5, 30, 0)))
                    .RuleFor(c => c.WeeklyAppointmentLimit, f => f.Random.Int(4, 6))
                    .RuleFor(c => c.VerificationCode, GenerateInvitationCode());

                var place = testPlace.Generate();
                places.Add(place);
            }

            return places;
        }

        public static List<Announcement> CreateAnnouncements()
        {
            List<Announcement> announcements = new List<Announcement>();
            DateTime firstDate = new DateTime(2020, 2, 5);
            DateTime secondDate = new DateTime(2020, 4, 30);
            for (int i = 0; i < 20; i++)
            {

                var testAnnouncement = new Faker<Announcement>()
                    .RuleFor(c => c.Id, f => Guid.NewGuid())
                    .RuleFor(c => c.Text, f => f.Lorem.Sentence(10, 14))
                    .RuleFor(c => c.Place, new Place())
                    .RuleFor(c => c.Date, f => f.Date.Between(firstDate, secondDate));
                var announcement = testAnnouncement.Generate();
                announcements.Add(announcement);
            }

            return announcements;

        }

        public static List<Owner> CreateOwner()
        {
            List<Owner> owners = new List<Owner>();
            for (int i = 0; i < 2; i++)
            {
                var testOwner = new Faker<Owner>()
                    .RuleFor(c => c.Id, f => Guid.NewGuid())
                    .RuleFor(c => c.Name, f => f.Name.FirstName())
                    .RuleFor(c => c.LastName, f => f.Name.LastName())
                    .RuleFor(c => c.EMail, (f, u) => f.Internet.Email(u.Name, u.LastName))
                    .RuleFor(c => c.Place, new Place())
                    .RuleFor(c => c.Password, "1234" + i)
                    .RuleFor(c => c.Role, Role.Business);

                var owner = testOwner.Generate();
                owners.Add(owner);
            }
            return owners;
        }

        public static List<Appointment> CreateAppointments()
        {
            DateTime startDate = new DateTime(2020, 6, 15);
            DateTime endDate = new DateTime(2020, 8, 25);
            DateTime applicationDate = new DateTime(2020, 5, 30);

            List<Appointment> appointments = new List<Appointment>();

            for (int i = 0; i < 1000; i++)
            {
                var month = new Faker().Random.Number(6, 7);
                var day = new Faker().Random.Number(1, 28);
                var hour = new Faker().Random.Number(9, 18);
                var aperture = new Faker().Random.Number(1, 4); // saat aralığı

                var testAppointment = new Faker<Appointment>()
                    .RuleFor(c => c.Id, f => Guid.NewGuid())
                    .RuleFor(c => c.ApplicationDate, f => new DateTime(2020, month, day, hour - 2, 0, 0))
                    .RuleFor(c => c.IsApproved, f => f.Random.Bool(.80f))
                    .RuleFor(c => c.Place, new Place())
                    .RuleFor(c => c.User, new User())
                    .RuleFor(c => c.StartDate, f => new DateTime(2020, month, day, hour, 0, 0))
                    .RuleFor(c => c.EndDate, f => new DateTime(2020, month, day, hour + aperture, 0, 0));

                var appointment = testAppointment.Generate();
                appointments.Add(appointment);
            }

            return appointments;
        }

        public static void DataControls()
        {
            List<Appointment> appointments = CreateAppointments();
            List<Owner> owners = CreateOwner();
            List<Announcement> announcements = CreateAnnouncements();
            List<User> users = CreateUsers();
            List<Place> places = CreatePlaces();

            for (int i = 0; i < 3; i++)
            {
                Console.WriteLine(appointments[i].Id);
                Console.WriteLine("Start Date: " + appointments[i].StartDate);
                Console.WriteLine("End Date: " + appointments[i].EndDate);
                Console.WriteLine(appointments[i].ApplicationDate);
                Console.WriteLine(appointments[i].IsApproved);
                Console.WriteLine("**************************************\n");
            }
            Console.WriteLine("--------------------- End Of Appointments\n");
            for (int i = 0; i < 2; i++)
            {
                Console.WriteLine(owners[i].Id);
                Console.WriteLine(owners[i].EMail);
                Console.WriteLine(owners[i].Name + " " + owners[i].LastName);
                Console.WriteLine("**************************************\n");
            }
            Console.WriteLine("--------------------- End Of Owners\n");

            for (int i = 0; i < 2; i++)
            {
                Console.WriteLine(places[i].Id);
                Console.WriteLine(places[i].Name);
                Console.WriteLine(places[i].Address);
                Console.WriteLine(places[i].OpeningTime);
                Console.WriteLine(places[i].RegistrationDate);
                Console.WriteLine(places[i].MaxAppointmentTime);
                Console.WriteLine(places[i].WeeklyAppointmentLimit);
                Console.WriteLine("**************************************\n");
            }
            Console.WriteLine("--------------------- End Of Places\n");

            for (int i = 0; i < 3; i++)
            {
                Console.WriteLine(users[i].Id);
                Console.WriteLine(users[i].Name + " " + users[i].LastName);
                Console.WriteLine(users[i].CurrentAppointmentCount);
                Console.WriteLine(users[i].AnonymousName);
                Console.WriteLine(users[i].RegistrationDate);
                Console.WriteLine(users[i].EMail);
                Console.WriteLine(users[i].Gender);
                Console.WriteLine("**************************************\n");
            }
            Console.WriteLine("--------------------- End Of Users\n");

            for (int i = 0; i < 3; i++)
            {
                Console.WriteLine(announcements[i].Id);
                Console.WriteLine(announcements[i].Text);
                Console.WriteLine(announcements[i].Date);
                Console.WriteLine("**************************************\n");
            }
            Console.WriteLine("--------------------- End Of Announcements");
        }

        public static void DataExchange(FsDataContext context)
        {
            List<Appointment> appointments = CreateAppointments();
            List<Owner> owners = CreateOwner();
            List<Announcement> announcements = CreateAnnouncements();
            List<User> users = CreateUsers();
            List<Place> places = CreatePlaces();
            List<UserPlace> userPlaces = new List<UserPlace>();
            List<UserPlace> userPlacesforUser = new List<UserPlace>();

            foreach (var appointment in appointments)
            {
                var index = appointments.IndexOf(appointment);
                appointment.Place = index < 500 ? places[0] : places[1];
                appointment.User = users[(index % 10)];
                appointment.IsActive = false;
            }

            foreach (var owner in owners)
            {
                owner.Place = places[owners.IndexOf(owner)];
            }

            foreach (var announcement in announcements)
            {
                var index = announcements.IndexOf(announcement);
                announcement.IsRead = false;
                announcement.Place = index < 10 ? places[0] : places[1];
            }

            //for (int i = 0; i < users.Count; i++)
            //{
            //    var userPlace = new UserPlace();
            //    userPlace.Place = i < 50 ? places[0] : places[1];
            //    userPlace.PlaceId = i < 50 ? places[0].Id : places[1].Id;
            //    userPlace.User = users[i];
            //    userPlace.UserId = users[i].Id;
            //    userPlaces.Add(userPlace);
            //}

            foreach (var user in users)
            {
                UserPlace userPlace = new UserPlace();

                var index = users.IndexOf(user);

                user.Place = new Place();
                // user.UserPlaces.Add(userPlaces.FirstOrDefault(c => c.UserId == user.Id));
                user.Appointments = appointments.GetRange(index * 10, 10);
            }

            foreach (var place in places)
            {
                var index = places.IndexOf(place);

                place.Owner = owners[places.IndexOf(place)];
                place.Appointments = appointments.GetRange(index * 500, 500);
                place.Announcements = announcements.GetRange(index * 10, 10);
                place.Users = users.GetRange(index * 50, 50);
            }

            context.Appointments.AddRange(appointments);
            context.Owners.AddRange(owners);
            context.Announcements.AddRange(announcements);
            context.Users.AddRange(users);
            context.Places.AddRange(places);
            context.SaveChanges();

        }

        private static string GenerateInvitationCode()
        {
            char[] characters = { 'A', 'B', 'D', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'Y', 'Z' };

            StringBuilder code = new StringBuilder();

            for (int i = 0; i < 8; i++)
            {
                var rnd = new Random().Next(0, characters.Length);

                code.Append(characters[rnd]);
            }

            return code.ToString();
        }
    }
}
