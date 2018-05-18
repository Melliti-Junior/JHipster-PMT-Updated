package com.erp.app.config.dbmigrations;

import com.erp.app.domain.Authority;
import com.erp.app.security.AuthoritiesConstants;
import com.github.mongobee.changeset.ChangeLog;
import com.github.mongobee.changeset.ChangeSet;
import org.springframework.data.mongodb.core.MongoTemplate;

@ChangeLog(order = "002")
public class OtherInitialSetupMigration {

    @ChangeSet(order = "03", author = "initiator", id = "03-addOtherAuthorities")
    public void addAuthorities(MongoTemplate mongoTemplate) {
        Authority managerAuthority = new Authority();
        managerAuthority.setName(AuthoritiesConstants.MANAGER);
        mongoTemplate.save(managerAuthority);

        Authority employeeAuthority = new Authority();
        employeeAuthority.setName(AuthoritiesConstants.EMPLOYEE);
        mongoTemplate.save(employeeAuthority);
    }
}
