exports.table = [
  {
    tableName: "users",
    query:
      "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY,email VARCHAR(255) NULL,password VARCHAR(255) NULL,user_name VARCHAR(255) NULL,mobile_number BIGINT NULL UNIQUE,name VARCHAR(255) NULL,passport_number VARCHAR(255) NULL,passport_front VARCHAR(255) NULL,passport_back VARCHAR(255) NULL,role ENUM('Global Admin', 'Super Admin', 'Admin', 'Broker', 'Informatic Broker (IB)'),user_type ENUM('1', '2'),gender VARCHAR(255) NULL,dob VARCHAR(255) NULL,acc_no VARCHAR(255) NULL,c_acc_no VARCHAR(255) NULL,ifsc_code VARCHAR(255) NULL,bank_name VARCHAR(255) NULL,branch_name VARCHAR(255) NULL,acc_holder_name VARCHAR(255) NULL,kyc_status VARCHAR(255) NULL,passport_reason TEXT NULL,email_reason TEXT NULL,createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, country VARCHAR(255) NULL,country_code VARCHAR(10) NULL, otp_hash` VARCHAR(255) NULL, otp_time` VARCHAR(255) NULL,`refer_id` VARCHAR(255) NULL,`refred_by_id` VARCHAR(255) NULL,`google_auth_json` TEXT NULL DEFAULT NULL, `google_hash` VARCHAR(255) NULL DEFAULT NULL, `google_auth_json`, ADD `google_ascii` VARCHAR(255) NULL DEFAULT NULL,`enable_2fa` ENUM('Y','N') NOT NULL DEFAULT 'N',`google_auth_verify` ENUM('Y','N') NOT NULL DEFAULT 'N', is_crypto_enabled ENUM('no', 'yes') NOT NULL DEFAULT 'no',is_equity_enabled ENUM('no', 'yes') NOT NULL DEFAULT 'no',is_fx_enabled ENUM('no', 'yes') NOT NULL DEFAULT 'no',`is_contact_verified` ENUM('yes','no') NOT NULL DEFAULT 'no',`is_onboared` ENUM('Y','N') NOT NULL DEFAULT 'N');",
  },{
    tableName:"otp_storage",
    query: 
     "CREATE TABLE IF NOT EXISTS otp_storage (id INT AUTO_INCREMENT PRIMARY KEY,user_email VARCHAR(255) NOT NULL,otp_hash VARCHAR(255) NOT NULL,createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)"
  }
  
];
