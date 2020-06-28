using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FitnessScheduling.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessScheduling.Data
{
    public class FsDataContext:DbContext
    {
        public FsDataContext(DbContextOptions<FsDataContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            //modelBuilder.Entity<Appointment>()
            //    .HasOne<User>(c => c.User)
            //    .WithMany(c => c.Appointments)
            //    .HasForeignKey(c => c.UserId);

            //modelBuilder.Entity<Appointment>()
            //    .HasOne<Place>(c => c.Place)
            //    .WithMany(c => c.Appointments)
            //    .HasForeignKey(c => c.PlaceId);

            modelBuilder.Entity<Owner>()
                .HasOne(a => a.Place)
                .WithOne(c => c.Owner)
                .HasForeignKey<Place>(d => d.OwnerRef);

            modelBuilder.Entity<User>()
                .HasOne(c => c.Place)
                .WithMany(c => c.Users)
                .HasForeignKey(d => d.PlaceRef);

            //modelBuilder.Entity<UserPlace>().HasKey(up => new { up.UserId, up.PlaceId });

            //modelBuilder.Entity<User>()
            //    .HasOne<Place>(c => c.Place)
            //    .WithMany(c => c.Users)
            //    .HasForeignKey(c => c.PlaceId);

            //modelBuilder.Entity<Announcement>()
            //    .HasOne<Place>(c => c.Place)
            //    .WithMany(c => c.Announcements)
            //    .HasForeignKey(c => c.PlaceId);


            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Place> Places { get; set; }
        public DbSet<User> Users { get; set; }
        //public DbSet<UserPlace> UserPlaces { get; set; }
        public DbSet<Owner> Owners { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
    }
}
