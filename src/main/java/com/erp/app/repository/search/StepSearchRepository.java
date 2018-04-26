package com.erp.app.repository.search;

import com.erp.app.domain.Step;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Step entity.
 */
public interface StepSearchRepository extends ElasticsearchRepository<Step, String> {
}
