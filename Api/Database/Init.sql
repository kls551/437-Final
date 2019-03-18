drop database if exists ksoeHouse;
create database ksoeHouse;
use ksoeHouse;

create table Person (
   id int auto_increment primary key,
   firstName varchar(30),
   lastName varchar(30) not null,
   email varchar(30) not null,
   password varchar(50),
   whenRegistered datetime not null,
   termsAccepted datetime,
   role int unsigned not null,  # 0 normal, 1 admin
   unique key(email)
);

create table Listing (
   id int auto_increment primary key,
   ownerId int,
   title varchar(80) not null,
   description varchar(1000) not null,
   price decimal(10,2) not null,
   numBed int,
   location varchar(50),
   contactInfo varchar(200),
   postedDate BIGINT,
   constraint FKMessage_ownerId foreign key (ownerId) references Person(id)
    on delete cascade,
   unique key UK_title(title)
);

create table Image (
   id int auto_increment primary key,
   publicId varchar(200) not null,
   ListingId int not null,
   imageUrl varchar(5000) not null,
   constraint FKMessage_cnvId foreign key (ListingId) references Listing(id)
    on delete cascade
);

insert into Person (firstName, lastName, email,       password,   whenRegistered, role)
            VALUES ("Joe",     "Admin", "adm@11.com", "password", NOW(), 1);
