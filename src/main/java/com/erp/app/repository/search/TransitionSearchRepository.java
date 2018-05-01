package com.erp.app.repository.search;

import com.erp.app.domain.Transition;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Transition entity.
 */
public interface TransitionSearchRepository extends ElasticsearchRepository<Transition, String> {
}
