using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FitnessScheduling.Data;
using FitnessScheduling.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessScheduling.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DefaultController : ControllerBase
    {
        private FsDataContext _context;
        public DefaultController(FsDataContext context)
        {
            _context = context;
        }

        [HttpGet("appointments")]
        [Authorize]
        public IActionResult GetAppointmentsByPlace([FromQuery]Guid userId, [FromQuery]int count = 10)
        {
            var today = DateTime.Today;

            var user = _context.Users.Include(c => c.Place).FirstOrDefault(c => c.Id == userId);
            if (user == null)
            {
                return null;

            }
            var appointments = _context.Appointments
                .Where(c => c.PlaceId == user.PlaceRef && DateTime.Compare(c.ApplicationDate, today) > 0)
                .OrderBy(c => c.StartDate).Take(count).ToList();

            return Ok(appointments);
        }

        [HttpGet("schedulingAppointments")]
        [Authorize]
        public IEnumerable<SchedulingAppointment> GetSchedulingAppointments([FromQuery]Guid id, [FromQuery]bool isAccountTypeUser)
        {
            var today = DateTime.Today;
            List<SchedulingAppointment> schedulingAppointments = new List<SchedulingAppointment>();

            if (isAccountTypeUser)
            {
                var user = _context.Users.Include(c => c.Place).FirstOrDefault(c => c.Id == id);
                if (user == null)
                {
                    return null;
                }

                var appointments = _context.Appointments
                    .Where(c => c.PlaceId == user.PlaceRef && DateTime.Compare(c.ApplicationDate, today) > 0);

                if (appointments.Count() < 0)
                {
                    return null;
                }

                foreach (var appointment in appointments)
                {
                    var sa = new SchedulingAppointment();

                    if (schedulingAppointments.Exists(s => s.StartDate == appointment.StartDate && s.EndDate == appointment.EndDate))
                    {
                        sa = schedulingAppointments.Find(s =>
                            s.StartDate == appointment.StartDate && s.EndDate == appointment.EndDate);

                        sa.Count = sa.Count + 1;
                    }
                    else
                    {
                        sa.Count = 1;
                        sa.StartDate = appointment.StartDate;
                        sa.EndDate = appointment.EndDate;

                        schedulingAppointments.Add(sa);
                    }

                }

                return schedulingAppointments;

            }
            else
            {
                var place = _context.Places.FirstOrDefault(c => c.OwnerRef == id);

                if (place == null)
                {
                    return null;
                }

                var appointments = _context.Appointments
                    .Where(c => c.PlaceId == place.Id && DateTime.Compare(c.ApplicationDate, today) > 0);

                if (appointments.Count() < 0)
                {
                    return null;
                }

                foreach (var appointment in appointments)
                {
                    var sa = new SchedulingAppointment();

                    if (schedulingAppointments.Exists(s => s.StartDate == appointment.StartDate && s.EndDate == appointment.EndDate))
                    {
                        sa = schedulingAppointments.Find(s =>
                            s.StartDate == appointment.StartDate && s.EndDate == appointment.EndDate);

                        sa.Count = sa.Count + 1;
                    }
                    else
                    {
                        sa.Count = 1;
                        sa.StartDate = appointment.StartDate;
                        sa.EndDate = appointment.EndDate;

                        schedulingAppointments.Add(sa);
                    }

                }

                return schedulingAppointments;

            }

        }

        [HttpGet("place")]
        [Authorize]
        public IActionResult GetPlaces([FromQuery] Guid placeId)
        {
            var place = _context.Places
                .FirstOrDefault(c => c.Id == placeId);

            return Ok(place);
        }
        [HttpGet("PlaceByUser")]
        [Authorize]
        public IActionResult GetPlacesByUser([FromQuery] Guid userId)
        {
            try
            {

                var place = _context.Users.Include(c => c.Place)
                    .FirstOrDefault(c => c.Id == userId)?.Place;

                return Ok(place);
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }


        public class AllData
        {
            public List<Appointment> Appointments { get; set; }
            public List<Owner> Owners { get; set; }
            public List<Place> Places { get; set; }
            public List<User> Users { get; set; }
            public List<Announcement> Announcements { get; set; }

        }
    }
}