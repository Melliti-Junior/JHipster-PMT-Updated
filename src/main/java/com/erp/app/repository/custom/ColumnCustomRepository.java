package com.erp.app.repository.custom;

import com.erp.app.domain.custom.ColumnCustom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColumnCustomRepository extends MongoRepository<ColumnCustom, String> {

}
